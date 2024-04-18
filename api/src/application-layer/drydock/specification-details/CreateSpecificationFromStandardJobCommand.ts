import { DataUtilService } from 'j2utils';

import { validateAgainstModel } from '../../../common/drydock/ts-helpers/validate-against-model';
import { AsyncJobsRepository } from '../../../dal/drydock/async-jobs/AsyncJobsRepository';
import { CreateInspectionsDto } from '../../../dal/drydock/specification-details/dtos';
import { CreateSpecificationFromStandardJobDto } from '../../../dal/drydock/specification-details/dtos/ICreateSpecificationFromStandardJobDto';
import { SpecificationDetailsRepository } from '../../../dal/drydock/specification-details/SpecificationDetailsRepository';
import { SpecificationDetailsEntity } from '../../../entity/drydock';
import { SpecificationDetailsSubItemEntity } from '../../../entity/drydock/SpecificationDetailsSubItemEntity';
import { RabbitMQClient } from '../../../mqs/client';
import { RabbitMQTopic } from '../../../mqs/subscriptions';
import { Command } from '../core/cqrs/Command';
import { UpdateSpecificationDetailsDto } from './dtos/UpdateSpecificationDetailsDto';

export class CreateSpecificationFromStandardJobsCommand extends Command<CreateSpecificationFromStandardJobDto, string> {
    specificationRepository = new SpecificationDetailsRepository();
    asyncJobsRepository = new AsyncJobsRepository();

    protected async ValidationHandlerAsync(request: CreateSpecificationFromStandardJobDto): Promise<void> {
        await validateAgainstModel(CreateSpecificationFromStandardJobDto, request);
    }

    protected async MainHandlerAsync(request: CreateSpecificationFromStandardJobDto) {
        const specificationsData = await this.specificationRepository.getSpecificationFromStandardJob(
            request,
            request.createdBy,
        );

        const specificationInspections: CreateInspectionsDto[] = [];
        const specificationSubItems: SpecificationDetailsSubItemEntity[] = [];
        const specificationAuditData: UpdateSpecificationDetailsDto[] = [];

        specificationsData
            .map((spec) => spec.specification)
            .forEach((specification) => {
                const inspections = specification.inspections;
                const subItems = specification.SubItems;

                if (inspections.length) {
                    const data: CreateInspectionsDto[] = inspections.map((inspection) => {
                        const item: CreateInspectionsDto = {
                            uid: DataUtilService.newUid(),
                            LIBSurveyCertificateAuthorityID: inspection.ID!,
                            SpecificationDetailsUid: specification.uid,
                        };
                        return item;
                    });

                    specificationInspections.push(...data);
                }

                if (subItems.length) {
                    const newSubItems = subItems.map((subItem) => {
                        return {
                            uid: DataUtilService.newUid(),
                            specificationDetails: {
                                uid: specification.uid,
                            } as SpecificationDetailsEntity,
                            subject: subItem.subject,
                            active_status: true,
                            discount: '0',
                        } as SpecificationDetailsSubItemEntity;
                    });

                    specificationSubItems.push(...newSubItems);
                }

                const auditData: UpdateSpecificationDetailsDto = {
                    uid: specification.uid,
                    Subject: specification.Subject,
                    Inspections: specification.inspections.map((inspection) => inspection.ID!),
                    Description: specification.Description,
                    DoneByUid: specification.DoneByUid,
                    Completion: specification.Completion,
                    Duration: specification.Duration,
                    StartDate: specification.StartDate ?? undefined,
                    EndDate: specification.EndDate ?? undefined,
                    UserId: '',
                };

                specificationAuditData.push(auditData);
            });

        const asyncJobUid = DataUtilService.newUid();

        const asyncJobPromise = this.asyncJobsRepository.CreateAsyncJob(
            asyncJobUid,
            RabbitMQTopic.CREATE_SPECIFICATIONS_FROM_STANDARD_JOBS,
            new Date(),
            request.createdBy,
        );

        await (
            await RabbitMQClient.getInstance()
        ).publish(RabbitMQTopic.CREATE_SPECIFICATIONS_FROM_STANDARD_JOBS, {
            token: request.token,
            createdBy: request.createdBy,
            specificationsData,
            specificationInspections,
            specificationSubItems,
            specificationAuditData,
            asyncJobUid,
        });

        await asyncJobPromise;

        return asyncJobUid;
    }
}
