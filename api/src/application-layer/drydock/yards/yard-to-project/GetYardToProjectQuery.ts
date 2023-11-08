import { YardToProjectRepository } from '../../../../dal/drydock/yards/yard-to-project/YardToProjectRepository';
import { YardToProjectEntity } from '../../../../entity/yard_to_project';
import { Query } from '../../core/cqrs/Query';

export class GetYardToProjectQuery extends Query<string, YardToProjectEntity> {
    yardToProjectRepository = new YardToProjectRepository();

    protected async AuthorizationHandlerAsync(): Promise<void> {
        return;
    }

    protected async ValidationHandlerAsync(): Promise<void> {
        return;
    }

    /**
     * @returns All yard details specific to project
     */
    protected async MainHandlerAsync(projectUid: string): Promise<YardToProjectEntity> {
        const yardToProjectList = await this.yardToProjectRepository.getYardsToProject(projectUid);
        return yardToProjectList;
    }
}
