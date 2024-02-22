import { ApplicationException } from '../../../../bll/drydock/core/exceptions';
import { JobOrdersRepository } from '../../../../dal/drydock/projects/job-orders/JobOrdersRepository';
import { ProjectsRepository } from '../../../../dal/drydock/projects/ProjectsRepository';
import { SpecificationDetailsRepository } from '../../../../dal/drydock/specification-details/SpecificationDetailsRepository';
import { Query } from '../../core/cqrs/Query';
import { GetLatestJobOrderBySpecificationDto } from './dtos/GetLatestJobOrderBySpecificationDto';
import { JobOrderDto } from './dtos/JobOrderDto';

export class GetJobOrderBySpecificationUidQuery extends Query<GetLatestJobOrderBySpecificationDto, JobOrderDto | null> {
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
    protected async MainHandlerAsync(request: GetLatestJobOrderBySpecificationDto): Promise<JobOrderDto | null> {
        const specification = await this.specificationDetailsRepository.TryGetSpecification(request.specificationUid);

        if (!specification) {
            throw new ApplicationException(`Specification ${request.specificationUid} not found`);
        }

        const project = await this.projectsRepository.TryGetProjectByUid(specification.ProjectUid);

        if (!project) {
            throw new ApplicationException(`Project ${specification.ProjectUid} not found`);
        }

        const jobOrder = await this.jobOrderRepository.getLatestJobOrderBySpecificationUid(request.specificationUid);

        if (!jobOrder) {
            return null;
        }

        return {
            JobOrderUid: jobOrder.uid,
            SpecificationUid: jobOrder.SpecificationUid,
            Remarks: jobOrder.Remarks,
            Progress: jobOrder.Progress,
            Status: jobOrder.Status,
            Subject: jobOrder.Subject,
            SpecificationEndDate: specification.EndDate ?? project.EndDate,
            SpecificationStartDate: specification.StartDate ?? project.StartDate,
        };
    }
}
