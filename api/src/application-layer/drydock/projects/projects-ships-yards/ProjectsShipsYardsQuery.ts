import { ProjectsRepository } from '../../../../dal/drydock/projects/ProjectsRepository';
import { Query } from '../../core/cqrs/Query';
import { IProjectsShipsYardsResultDto } from './IProjectsShipsYardsResultDto';

export class ProjectsShipsYardsQuery extends Query<void, IProjectsShipsYardsResultDto[]> {
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

    protected async MainHandlerAsync(): Promise<IProjectsShipsYardsResultDto[]> {
        const dtos: IProjectsShipsYardsResultDto[] = [];

        dtos.push({ ShipYardId: '1', ShipYardName: 'Shipyard 1' });
        dtos.push({ ShipYardId: '2', ShipYardName: 'Shipyard 2' });

        return dtos;
    }
}
