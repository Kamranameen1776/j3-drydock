import { YardsProjectsRepository } from '../../../../dal/drydock/project-yards/YardsProjectsRepository';
import { Query } from '../../core/cqrs/Query';
import { GetProjectYardsDto } from './dtos/GetProjectYardsDto';

export class GetProjectYardsQuery extends Query<string, GetProjectYardsDto> {
    yardProjectsRepository = new YardsProjectsRepository();

    protected async AuthorizationHandlerAsync(): Promise<void> {
        return;
    }

    protected async ValidationHandlerAsync(): Promise<void> {
        return;
    }

    protected async MainHandlerAsync(uid: string): Promise<GetProjectYardsDto> {
        return this.yardProjectsRepository.getAllByProject(uid);
    }
}
