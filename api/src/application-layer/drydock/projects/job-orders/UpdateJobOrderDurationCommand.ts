import { validate } from 'class-validator';
import { SynchronizerService } from 'j2utils';

import { ApplicationException } from '../../../../bll/drydock/core/exceptions';
import { getTableName } from '../../../../common/drydock/ts-helpers/tableName';
import { JobOrdersRepository } from '../../../../dal/drydock/projects/job-orders/JobOrdersRepository';
import { SpecificationDetailsRepository } from '../../../../dal/drydock/specification-details/SpecificationDetailsRepository';
import { VesselsRepository } from '../../../../dal/drydock/vessels/VesselsRepository';
import { SpecificationDetailsEntity } from '../../../../entity/drydock';
import { JobOrderEntity } from '../../../../entity/drydock/JobOrderEntity';
import { Command } from '../../core/cqrs/Command';
import { UnitOfWork } from '../../core/uof/UnitOfWork';
import { UpdateJobOrderStartEndDateDto } from './dtos/UpdateJobOrderStartEndDateDto';

export class UpdateJobOrderDurationCommand extends Command<UpdateJobOrderStartEndDateDto, void> {
    jobOrderRepository: JobOrdersRepository;

    vesselRepository: VesselsRepository;

    specificationDetailsRepository: SpecificationDetailsRepository;

    jobOrderTableName = getTableName(JobOrderEntity);

    specificationDetailsTableName = getTableName(SpecificationDetailsEntity);

    uow: UnitOfWork;

    constructor() {
        super();

        this.jobOrderRepository = new JobOrdersRepository();
        this.specificationDetailsRepository = new SpecificationDetailsRepository();
        this.uow = new UnitOfWork();
        this.vesselRepository = new VesselsRepository();
    }

    protected async AuthorizationHandlerAsync(): Promise<void> {
        return;
    }

    protected async ValidationHandlerAsync(request: UpdateJobOrderStartEndDateDto): Promise<void> {
        if (!request) {
            throw new Error('Request is null');
        }

        const result = await validate(request, { skipMissingProperties: true });

        if (result.length) {
            throw result;
        }
    }

    /**
     * @description Update Job Order Start and End Date
     */
    protected async MainHandlerAsync(request: UpdateJobOrderStartEndDateDto): Promise<void> {
        const specification = await this.specificationDetailsRepository.TryGetSpecification(request.SpecificationUid);

        if (!specification) {
            throw new ApplicationException(`Specification ${request.SpecificationUid} not found`);
        }

        specification.StartDate = request.SpecificationStartDate;
        specification.EndDate = request.SpecificationEndDate;

        const vessel = await this.vesselRepository.GetVesselBySpecification(request.SpecificationUid);

        await this.uow.ExecuteAsync(async (queryRunner) => {
            const updatedSpecification = new SpecificationDetailsEntity();
            updatedSpecification.uid = specification.uid;
            updatedSpecification.StartDate = specification.StartDate;
            updatedSpecification.EndDate = specification.EndDate;

            if (request.Progress) {
                const jobOrder = await this.jobOrderRepository.TryGetJobOrderBySpecification(specification.uid);

                if (!jobOrder) {
                    throw new ApplicationException(
                        `Job order for specification ${request.SpecificationUid} is not found`,
                    );
                }

                jobOrder.LastUpdated = request.LastUpdated;
                jobOrder.Progress = request.Progress;

                await this.jobOrderRepository.UpdateJobOrder(jobOrder, queryRunner);

                await SynchronizerService.dataSynchronizeManager(
                    queryRunner.manager,
                    this.jobOrderTableName,
                    'specification_uid',
                    specification.uid,
                    vessel.VesselId,
                );
            }

            await this.specificationDetailsRepository.UpdateSpecificationDetailsByEntity(
                updatedSpecification,
                queryRunner,
            );

            await SynchronizerService.dataSynchronizeManager(
                queryRunner.manager,
                this.specificationDetailsTableName,
                'uid',
                specification.uid,
                vessel.VesselId,
            );
        });
    }
}
