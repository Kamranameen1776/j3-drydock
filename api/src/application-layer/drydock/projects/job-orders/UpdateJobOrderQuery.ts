import { validate } from 'class-validator';

import { JobOrdersRepository } from '../../../../dal/drydock/projects/job-orders/JobOrdersRepository';
import { UpdateJobOrderDto } from '../../../../dal/drydock/projects/job-orders/UpdateJobOrderDto';
import { SpecificationDetailsRepository } from '../../../../dal/drydock/specification-details/SpecificationDetailsRepository';
import { Query } from '../../core/cqrs/Query';
import { ApplicationException } from '../../../../bll/drydock/core/exceptions';

export class UpdateJobOrderQuery extends Query<UpdateJobOrderDto, void> {
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
     * @returns All specification details
     */
    protected async MainHandlerAsync(request: UpdateJobOrderDto): Promise<void> {
        // 1. get specification
        // 2. update specification start date, end date
        const specification = await this.specificationDetailsRepository.TryGetSpecification(request.SpecificationUid);

        if (!specification) {
            throw new ApplicationException(`Specification ${request.SpecificationUid} not found`);
        }

        // 3. load job order

        const jobOrder = await this.jobOrderRepository.TryGetJobOrderBySpecification(specification.uid);

        if (!data) {
            // 4. if job order exists, create it
            // TODO: implement
            // const data = await this.repository.CreateJobOrderBySpecification(request.SpecificationUid);
        } else {
            // 5. if job order is not exists, update it
            // const data = await this.repository.GetJobOrderBySpecification(request);
        }
    }
}
