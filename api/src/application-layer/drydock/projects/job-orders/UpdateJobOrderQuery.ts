import { validate } from 'class-validator';
import { DataUtilService, SynchronizerService } from 'j2utils';

import { ApplicationException } from '../../../../bll/drydock/core/exceptions';
import { getTableName } from '../../../../common/drydock/ts-helpers/tableName';
import { JobOrdersRepository } from '../../../../dal/drydock/projects/job-orders/JobOrdersRepository';
import { UpdateJobOrderDto } from '../../../../dal/drydock/projects/job-orders/UpdateJobOrderDto';
import { SpecificationDetailsRepository } from '../../../../dal/drydock/specification-details/SpecificationDetailsRepository';
import { VesselsRepository } from '../../../../dal/drydock/vessels/VesselsRepository';
import { SpecificationDetailsEntity } from '../../../../entity/drydock';
import { JobOrderEntity } from '../../../../entity/drydock/JobOrderEntity';
import { Query } from '../../core/cqrs/Query';
import { UnitOfWork } from '../../core/uof/UnitOfWork';

export class UpdateJobOrderQuery extends Query<UpdateJobOrderDto, void> {
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

    protected async ValidationHandlerAsync(request: UpdateJobOrderDto): Promise<void> {
        if (!request) {
            throw new Error('Request is null');
        }

        const result = await validate(request);

        if (result.length) {
            throw result;
        }
    }

    /**
     * @description Update Job Order
     */
    protected async MainHandlerAsync(request: UpdateJobOrderDto): Promise<void> {
        const specification = await this.specificationDetailsRepository.TryGetSpecification(request.SpecificationUid);

        if (!specification) {
            throw new ApplicationException(`Specification ${request.SpecificationUid} not found`);
        }

        const vessel = await this.vesselRepository.GetVesselBySpecification(request.SpecificationUid);

        let jobOrder = await this.jobOrderRepository.TryGetJobOrderBySpecification(specification.uid);

        specification.StartDate = request.SpecificationStartDate;
        specification.EndDate = request.SpecificationEndDate;

        await this.uow.ExecuteAsync(async (queryRunner) => {
            const updatedSpecification = new SpecificationDetailsEntity();
            updatedSpecification.uid = specification.uid;
            updatedSpecification.StartDate = specification.StartDate;
            updatedSpecification.EndDate = specification.EndDate;

            await this.specificationDetailsRepository.UpdateSpecificationDetailsByEntity(
                updatedSpecification,
                queryRunner,
            );

            if (!jobOrder) {
                jobOrder = new JobOrderEntity();
                jobOrder.SpecificationUid = specification.uid;
                jobOrder.uid = request.uid ?? new DataUtilService().newUid();
                jobOrder.ProjectUid = specification.ProjectUid;
            }

            jobOrder.LastUpdated = request.LastUpdated;
            jobOrder.Progress = request.Progress;
            jobOrder.Status = request.Status;
            jobOrder.Subject = request.Subject;
            jobOrder.Remarks = request.Remarks;

            await this.jobOrderRepository.UpdateJobOrder(jobOrder, queryRunner);

            await SynchronizerService.dataSynchronizeManager(
                queryRunner.manager,
                this.jobOrderTableName,
                'specification_uid',
                jobOrder.SpecificationUid,
                vessel.VesselId,
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
