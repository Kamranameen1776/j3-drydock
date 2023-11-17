import { YardsProjectsRepository } from '../../../../dal/drydock/project-yards/YardsProjectsRepository';
import { Query } from '../../core/cqrs/Query';
import { GetProjectYardsResultDto } from './dtos/GetProjectYardsResultDto';

export class GetProjectYardsQuery extends Query<string, GetProjectYardsResultDto[]> {
    yardProjectsRepository = new YardsProjectsRepository();

    protected async AuthorizationHandlerAsync(): Promise<void> {
        return;
    }

    protected async ValidationHandlerAsync(): Promise<void> {
        return;
    }

    protected async MainHandlerAsync(uid: string): Promise<GetProjectYardsResultDto[]> {
        return this.yardProjectsRepository.getAllByProject(uid);
    }
}
