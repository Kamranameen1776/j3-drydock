import { YardsProjectsRepository } from '../../../dal/drydock/project-yards/YardsProjectsRepository';
import { Query } from '../core/cqrs/Query';
import { GetYardProjectsDto } from './dtos/GetYardProjectsDto';

export class GetYardProjectsQuery extends Query<string, GetYardProjectsDto> {
    yardProjectsRepository = new YardsProjectsRepository();

    protected async AuthorizationHandlerAsync(): Promise<void> {
        return;
    }

    protected async ValidationHandlerAsync(): Promise<void> {
        return;
    }

    protected async MainHandlerAsync(uid: string): Promise<GetYardProjectsDto> {
        return await this.yardProjectsRepository.getAllByProject(uid);
    }
}
