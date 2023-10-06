import { ProjectsRepository } from '../../../../dal/drydock/projects/ProjectsRepository';
import { Query } from '../../core/cqrs/Query';
import { ProjectsShipsYardsResultDto } from './ProjectsShipsYardsResultDto';

export class ProjectsShipsYardsQuery extends Query<void, ProjectsShipsYardsResultDto[]> {
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
    protected async MainHandlerAsync(): Promise<ProjectsShipsYardsResultDto[]> {

        const dtos = new Array<ProjectsShipsYardsResultDto>();

        dtos.push({ ShipYardId: '1', ShipYardName: 'Shipyard 1' });
        dtos.push({ ShipYardId: '2', ShipYardName: 'Shipyard 2' });

        return dtos;
    }
}
