import { YardProjectsRepository } from '../../../dal/drydock/yard-projects/YardProjectsRepository';
import { Query } from '../core/cqrs/Query';
import { GetYardProjectsDto } from './dtos/GetYardProjectsDto';

export class GetYardProjectsQuery extends Query<string, GetYardProjectsDto> {
    yardProjectsRepository = new YardProjectsRepository();

    protected async AuthorizationHandlerAsync(): Promise<void> {
        return;
    }

    protected async ValidationHandlerAsync(): Promise<void> {
        return;
    }

    protected async MainHandlerAsync(uid: string): Promise<GetYardProjectsDto> {
        const yardToProjectList = await this.yardProjectsRepository.getYardProjects(uid);
        return yardToProjectList;
    }
}
