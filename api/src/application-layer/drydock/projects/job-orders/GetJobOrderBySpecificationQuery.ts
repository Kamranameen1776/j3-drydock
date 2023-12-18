import { ApplicationException } from '../../../../bll/drydock/core/exceptions/ApplicationException';
import { JobOrdersRepository } from '../../../../dal/drydock/projects/job-orders/JobOrdersRepository';
import { SpecificationDetailsRepository } from '../../../../dal/drydock/specification-details/SpecificationDetailsRepository';
import { Query } from '../../core/cqrs/Query';
import { GetJobOrderBySpecificationDto } from './dtos/GetJobOrderBySpecificationDto';
import { JobOrderDto } from './dtos/JobOrderDto';

export class GetJobOrderBySpecificationQuery extends Query<GetJobOrderBySpecificationDto, JobOrderDto | null> {
    jobOrderRepository: JobOrdersRepository;
    specificationDetailsRepository: SpecificationDetailsRepository;

    constructor() {
        super();
        this.jobOrderRepository = new JobOrdersRepository();
        this.specificationDetailsRepository = new SpecificationDetailsRepository();
    }

    protected async AuthorizationHandlerAsync(): Promise<void> {
        return;
    }

    /**
     * @returns Job Order data by specification
     */
    protected async MainHandlerAsync(request: GetJobOrderBySpecificationDto): Promise<JobOrderDto | null> {
        const specification = await this.specificationDetailsRepository.TryGetSpecification(request.SpecificationUid);

        if (!specification) {
            throw new ApplicationException(`Specification ${request.SpecificationUid} not found`);
        }

        const jobOrder = await this.jobOrderRepository.TryGetJobOrderBySpecification(request.SpecificationUid);

        if (!jobOrder) {
            return null;
        }

        return {
            JobOrderUid: jobOrder.uid,
            SpecificationUid: jobOrder.SpecificationUid,
            Remarks: jobOrder.Remarks,
            Status: jobOrder.Status,
            Subject: jobOrder.Subject,
            SpecificationEndDate: specification.EndDate,
            SpecificationStartDate: specification.StartDate,
        };
    }
}
