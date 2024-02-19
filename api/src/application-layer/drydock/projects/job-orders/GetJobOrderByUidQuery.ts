import { ApplicationException } from '../../../../bll/drydock/core/exceptions';
import { JobOrdersRepository } from '../../../../dal/drydock/projects/job-orders/JobOrdersRepository';
import { ProjectsRepository } from '../../../../dal/drydock/projects/ProjectsRepository';
import { SpecificationDetailsRepository } from '../../../../dal/drydock/specification-details/SpecificationDetailsRepository';
import { Query } from '../../core/cqrs/Query';
import { GetJobOrderByUidDto } from './dtos/GetJobOrderByUidDto';
import { JobOrderDto } from './dtos/JobOrderDto';

export class GetJobOrderByUidQuery extends Query<GetJobOrderByUidDto, JobOrderDto | null> {
    jobOrderRepository: JobOrdersRepository;
    specificationDetailsRepository: SpecificationDetailsRepository;
    projectsRepository: ProjectsRepository;

    constructor() {
        super();
        this.jobOrderRepository = new JobOrdersRepository();
        this.specificationDetailsRepository = new SpecificationDetailsRepository();
        this.projectsRepository = new ProjectsRepository();
    }

    protected async AuthorizationHandlerAsync(): Promise<void> {
        return;
    }

    /**
     * @returns Job Order data by specification
     */
    protected async MainHandlerAsync(request: GetJobOrderByUidDto): Promise<JobOrderDto | null> {
        const jobOrder = await this.jobOrderRepository.getJobOrderByUid(request.uid);

        if (!jobOrder) {
            return null;
        }

        const specification = await this.specificationDetailsRepository.TryGetSpecification(jobOrder.SpecificationUid);

        if (!specification) {
            throw new ApplicationException(`Specification ${jobOrder.SpecificationUid} not found`);
        }

        const project = await this.projectsRepository.TryGetProjectByUid(specification.ProjectUid);

        if (!project) {
            throw new ApplicationException(`Project ${specification.ProjectUid} not found`);
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
