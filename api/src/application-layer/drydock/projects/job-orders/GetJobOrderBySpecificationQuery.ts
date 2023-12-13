import { JobOrdersRepository } from '../../../../dal/drydock/projects/job-orders/JobOrdersRepository';
import { Query } from '../../core/cqrs/Query';
import { GetJobOrderBySpecificationDto } from './dtos/GetJobOrderBySpecificationDto';
import { JobOrderDto } from './dtos/JobOrderDto';

export class GetJobOrderBySpecificationQuery extends Query<GetJobOrderBySpecificationDto, JobOrderDto | null> {
    repository: JobOrdersRepository;

    constructor() {
        super();
        this.repository = new JobOrdersRepository();
    }

    protected async AuthorizationHandlerAsync(): Promise<void> {
        return;
    }

    protected async ValidationHandlerAsync(): Promise<void> {
        return;
    }

    /**
     * @returns Job Order data by specification
     */
    protected async MainHandlerAsync(request: GetJobOrderBySpecificationDto): Promise<JobOrderDto | null> {
        const jobOrder = await this.repository.TryGetJobOrderBySpecification(request.SpecificationUid);

        if (!jobOrder) {
            return null;
        }

        return {
            JobOrderUid: jobOrder.uid,
            SpecificationUid: jobOrder.SpecificationUid,
            Remarks: jobOrder.Remarks,
        };
    }
}
