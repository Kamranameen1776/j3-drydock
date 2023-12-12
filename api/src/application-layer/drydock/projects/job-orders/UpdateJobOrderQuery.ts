import { validate } from 'class-validator';
import { DataUtilService } from 'j2utils';

import { ApplicationException } from '../../../../bll/drydock/core/exceptions';
import { JobOrdersRepository } from '../../../../dal/drydock/projects/job-orders/JobOrdersRepository';
import { UpdateJobOrderDto } from '../../../../dal/drydock/projects/job-orders/UpdateJobOrderDto';
import { SpecificationDetailsRepository } from '../../../../dal/drydock/specification-details/SpecificationDetailsRepository';
import { SpecificationDetailsEntity } from '../../../../entity/drydock';
import { JobOrderEntity } from '../../../../entity/drydock/JobOrderEntity';
import { Query } from '../../core/cqrs/Query';
import { UnitOfWork } from '../../core/uof/UnitOfWork';

export class UpdateJobOrderQuery extends Query<UpdateJobOrderDto, void> {
    jobOrderRepository: JobOrdersRepository;

    specificationDetailsRepository: SpecificationDetailsRepository;

    uow: UnitOfWork;

    constructor() {
        super();

        this.jobOrderRepository = new JobOrdersRepository();
        this.specificationDetailsRepository = new SpecificationDetailsRepository();
        this.uow = new UnitOfWork();
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

        let jobOrder = await this.jobOrderRepository.TryGetJobOrderBySpecification(specification.uid);

        specification.StartDate = request.SpecificationStartDate;
        // TODO: update end date once it is implemented in specification details page
        // specification.EndDate = request.SpecificationEndDate;

        await this.uow.ExecuteAsync(async (queryRunner) => {
            const updatedSpecification = new SpecificationDetailsEntity();
            updatedSpecification.uid = specification.uid;
            updatedSpecification.StartDate = new Date(request.SpecificationStartDate);

            await this.specificationDetailsRepository.UpdateSpecificationDetailsByEntity(
                updatedSpecification,
                queryRunner,
            );

            if (!jobOrder) {
                jobOrder = new JobOrderEntity();
                jobOrder.SpecificationUid = specification.uid;
                jobOrder.uid = new DataUtilService().newUid();
                jobOrder.ProjectUid = specification.ProjectUid;
            }

            jobOrder.LastUpdated = request.LastUpdated;
            jobOrder.Progress = request.Progress;
            jobOrder.Status = request.Status;
            jobOrder.Subject = request.Subject;

            await this.jobOrderRepository.UpdateJobOrder(jobOrder, queryRunner);
        });
    }
}
