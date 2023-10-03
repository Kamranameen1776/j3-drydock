import { forEach } from 'lodash';

import { ProjectsRepository } from '../../../../dal/drydock/projects/ProjectsRepository';
import { Query } from '../../core/cqrs/Query';
import { GetProjectsFromMainPageDto } from './dtos/GetProjectsFromMainPageDto';

export class GetProjectsFromMainPageQuery extends Query<void, GetProjectsFromMainPageDto[]> {
    projectsRepository: ProjectsRepository;

    constructor() {
        super();

        this.projectsRepository = new ProjectsRepository();
    }

    protected async AuthorizationHandlerAsync(): Promise<void> {
        return;
    }

    protected async ValidationHandlerAsync(): Promise<void> {
        return;
    }

    /**
     *
     * @returns All example projects, which were created after the latest projects date
     */
    protected async MainHandlerAsync(): Promise<GetProjectsFromMainPageDto[]> {
        const projectTypes = await this.projectsRepository.GetProjectTypes();
        const projectStates = await this.projectsRepository.GetProjectStates();

        const projects = await this.projectsRepository.GetProjectsForMainPage();

        const dtos: GetProjectsFromMainPageDto[] = [];
        forEach(projects, (project) => {
            const dto = new GetProjectsFromMainPageDto();

            dto.ProjectId = project.ProjectId;
            dto.ProjectShortCodeId = project.ProjectShortCodeId;
            dto.Subject = project.Subject;

            dtos.push(dto);
        });

        return dtos;
    }
}
