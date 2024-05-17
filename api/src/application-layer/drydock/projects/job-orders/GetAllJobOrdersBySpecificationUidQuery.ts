import { ApplicationException } from '../../../../bll/drydock/core/exceptions';
import { JobOrdersRepository } from '../../../../dal/drydock/projects/job-orders/JobOrdersRepository';
import { ProjectsRepository } from '../../../../dal/drydock/projects/ProjectsRepository';
import { SpecificationDetailsRepository } from '../../../../dal/drydock/specification-details/SpecificationDetailsRepository';
import { Query } from '../../core/cqrs/Query';
import { GetJobOrderBySpecificationDto } from './dtos/GetJobOrderBySpecificationDto';
import { JobOrderDto } from './dtos/JobOrderDto';

export class GetAllJobOrdersBySpecificationUidQuery extends Query<GetJobOrderBySpecificationDto, JobOrderDto[] | null> {
    jobOrderRepository: JobOrdersRepository;
    specificationDetailsRepository: SpecificationDetailsRepository;
    projectsRepository: ProjectsRepository;

    constructor() {
        super();
        this.jobOrderRepository = new JobOrdersRepository();
        this.specificationDetailsRepository = new SpecificationDetailsRepository();
        this.projectsRepository = new ProjectsRepository();
    }

    /**
     * @returns Job Order data by specification
     */
    protected async MainHandlerAsync(request: GetJobOrderBySpecificationDto): Promise<JobOrderDto[] | null> {
        const specification = await this.specificationDetailsRepository.TryGetSpecification(request.specificationUid);

        if (!specification) {
            throw new ApplicationException(`Specification ${request.specificationUid} not found`);
        }

        const project = await this.projectsRepository.TryGetProjectByUid(specification.ProjectUid);

        if (!project) {
            throw new ApplicationException(`Project ${specification.ProjectUid} not found`);
        }

        const jobOrders = await this.jobOrderRepository.getAllJobOrdersBySpecificationUid(request.specificationUid);

        if (!jobOrders || !jobOrders.length) {
            return null;
        }

        return jobOrders.map((jobOrder) => this.jobOrderRepository.mapJobOrderToDto(jobOrder, specification, project));
    }
}
