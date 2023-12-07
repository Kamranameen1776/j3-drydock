import { Request } from 'express';
import { AccessRights, DataUtilService, SynchronizerService } from 'j2utils';

import { SpecificationDetailsAuditService } from '../../../bll/drydock/specification-details/specification-details-audit.service';
import { SpecificationService } from '../../../bll/drydock/specification-details/SpecificationService';
import { ProjectsRepository } from '../../../dal/drydock/projects/ProjectsRepository';
import { CreateInspectionsDto } from '../../../dal/drydock/specification-details/dtos';
import { CreateSpecificationFromStandardJobDto } from '../../../dal/drydock/specification-details/dtos/ICreateSpecificationFromStandardJobDto';
import { SpecificationDetailsRepository } from '../../../dal/drydock/specification-details/SpecificationDetailsRepository';
import { SpecificationDetailsSubItemsRepository } from '../../../dal/drydock/specification-details/sub-items/SpecificationDetailsSubItemsRepository';
import { VesselsRepository } from '../../../dal/drydock/vessels/VesselsRepository';
import { LibVesselsEntity, SpecificationDetailsEntity } from '../../../entity/drydock';
import { SpecificationDetailsSubItemEntity } from '../../../entity/drydock/SpecificationDetailsSubItemEntity';
import { Command } from '../core/cqrs/Command';
import { UnitOfWork } from '../core/uof/UnitOfWork';
import { UpdateSpecificationDetailsDto } from './dtos/UpdateSpecificationDetailsDto';

export class CreateSpecificationFromStandardJobsCommand extends Command<Request, SpecificationDetailsEntity[]> {
    specificationRepository = new SpecificationDetailsRepository();
    uow = new UnitOfWork();
    specificationDetailsService = new SpecificationService();
    vesselsRepository = new VesselsRepository();
    projectRepository = new ProjectsRepository();
    subItemsRepository = new SpecificationDetailsSubItemsRepository();
    specificationDetailsAudit = new SpecificationDetailsAuditService();

    tableName = 'dry_dock.specification_details';
    tableNameInspections = 'dry_dock.specification_details_LIB_Survey_CertificateAuthority';
    tableNameSubItems = 'dry_dock.specification_details_sub_item';

    protected async MainHandlerAsync(request: Request) {
        const { UserUID: createdBy } = AccessRights.authorizationDecode(request);
        const body: CreateSpecificationFromStandardJobDto = request.body;
        const token: string = request.headers.authorization as string;

        const [project] = await this.projectRepository.GetProject(request.body.ProjectUid);
        const vessel: LibVesselsEntity = await this.vesselsRepository.GetVesselByUID(project.VesselUid);

        return this.uow.ExecuteAsync(async (queryRunner) => {
            const specifications = await this.specificationRepository.createSpecificationFromStandardJob(
                body,
                createdBy,
                queryRunner,
            );

            await Promise.all(
                specifications.map(async (specification) => {
                    const tmResult = await this.specificationDetailsService.TaskManagerIntegration(
                        { Subject: specification.Subject },
                        vessel,
                        token,
                    );

                    await this.specificationRepository.updateSpecificationTmUid(
                        specification.uid,
                        tmResult.uid,
                        queryRunner,
                    );

                    specification.TecTaskManagerUid = tmResult.uid;
                }),
            );

            const specificationCondition = `uid IN ('${specifications.map((i) => i.uid).join(`','`)}')`;
            // SYNCING specification_details
            await SynchronizerService.dataSynchronizeByConditionManager(
                queryRunner.manager,
                this.tableName,
                vessel.VesselId,
                specificationCondition,
            );

            const specificationInspections: CreateInspectionsDto[] = [];
            const specificationSubItems: SpecificationDetailsSubItemEntity[] = [];
            const specificationAuditData: UpdateSpecificationDetailsDto[] = [];

            specifications.forEach((specification) => {
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
                    const newSubItems: SpecificationDetailsSubItemEntity[] = subItems.map((subItem) => {
                        const item = {
                            uid: DataUtilService.newUid(),
                            specificationDetails: {
                                uid: specification.uid,
                            } as SpecificationDetailsEntity,
                            subject: subItem.subject,
                            active_status: true,
                        };
                        return item as SpecificationDetailsSubItemEntity;
                    });

                    specificationSubItems.push(...newSubItems);
                }

                const auditData: UpdateSpecificationDetailsDto = {
                    uid: specification.uid,
                    Subject: specification.Subject,
                    Inspections: specification.inspections.map((inspection) => inspection.ID!),
                    Description: specification.Description,
                    DoneByUid: specification.DoneByUid,
                };

                specificationAuditData.push(auditData);
            });

            await this.specificationRepository.CreateSpecificationInspection(specificationInspections, queryRunner);
            await this.subItemsRepository.createRawSubItems(specificationSubItems, queryRunner);

            // SYNC inspection
            const conditionInspections = `uid IN ('${specificationInspections.map((i) => i.uid).join(`','`)}')`;
            await SynchronizerService.dataSynchronizeByConditionManager(
                queryRunner.manager,
                this.tableNameInspections,
                vessel.VesselId,
                conditionInspections,
            );

            // SYNC sub items
            const conditionSubItems = `uid IN ('${specificationSubItems.map((i) => i.uid).join(`','`)}')`;
            await SynchronizerService.dataSynchronizeByConditionManager(
                queryRunner.manager,
                this.tableNameSubItems,
                vessel.VesselId,
                conditionSubItems,
            );

            // AUDIT
            await this.specificationDetailsAudit.auditManyCreatedSpecificationDetails(
                specificationAuditData,
                createdBy,
                queryRunner,
            );

            return specifications;
        });
    }
}
