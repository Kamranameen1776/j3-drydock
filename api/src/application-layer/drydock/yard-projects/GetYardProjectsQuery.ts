import { YardProjectsRepository } from '../../../dal/drydock/yard-projects/YardProjectsRepository';
import { YardProjectsEntity } from '../../../entity/yard_to_project';
import { Query } from '../core/cqrs/Query';

export class GetYardProjectsQuery extends Query<string, void> {
    yardProjectsRepository = new YardProjectsRepository();

    protected async AuthorizationHandlerAsync(): Promise<void> {
        return;
    }

    protected async ValidationHandlerAsync(): Promise<void> {
        return;
    }

    /**
     * @returns All yard details specific to project
     */
    protected async MainHandlerAsync(projectUid: string): Promise<void> {
        const yardToProjectList = await this.yardProjectsRepository.getYardProjects(projectUid);
        return yardToProjectList;
    }
}
