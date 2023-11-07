import { YardToProjectRepository } from '../../../../dal/drydock/yards/yard-to-project/YardToProjectRepository';
import { Query } from '../../core/cqrs/Query';
import { GetYardToProjectDto } from './dtos/GetYardToProjectDto';

export class GetYardToProjectQuery extends Query<string, GetYardToProjectDto> {
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
    protected async MainHandlerAsync(projectUid: string): Promise<GetYardToProjectDto> {
        const specDetails = await this.yardToProjectRepository.getYardsToProject(projectUid);
        return specDetails;
    }
}
