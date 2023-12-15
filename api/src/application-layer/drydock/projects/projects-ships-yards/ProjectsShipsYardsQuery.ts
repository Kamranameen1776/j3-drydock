import { ProjectsRepository } from '../../../../dal/drydock/projects/ProjectsRepository';
import { YardsRepository } from '../../../../dal/drydock/yards/YardsRepository';
import { Query } from '../../core/cqrs/Query';
import { IProjectsShipsYardsResultDto } from './IProjectsShipsYardsResultDto';

export class ProjectsShipsYardsQuery extends Query<void, IProjectsShipsYardsResultDto[]> {
    projectsRepository: ProjectsRepository;
    yardsRepository: YardsRepository;

    constructor() {
        super();

        this.projectsRepository = new ProjectsRepository();
        this.yardsRepository = new YardsRepository();
    }

    protected async AuthorizationHandlerAsync(): Promise<void> {
        return;
    }

    protected async ValidationHandlerAsync(): Promise<void> {
        return;
    }

    protected async MainHandlerAsync(): Promise<IProjectsShipsYardsResultDto[]> {
        const dtos: IProjectsShipsYardsResultDto[] = (await this.yardsRepository.getYards()).map((data) => ({
            ShipYardId: data.uid,
            ShipYardName: data.yardName,
        }));

        return dtos;
    }
}
