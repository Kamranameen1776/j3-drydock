import { LinkedYardsRepository } from '../../../../dal/drydock/yards/linked-yards/LinkedYardsRepository';
import { YardToProjectEntity } from '../../../../entity/yard_to_project';
import { Query } from '../../core/cqrs/Query';

export class GetLinkedYardsQuery extends Query<string, YardToProjectEntity> {
    linkedYardsRepository = new LinkedYardsRepository();

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
        const linkedYardDetails = await this.linkedYardsRepository.getLinkedYards(projectUid);
        return linkedYardDetails;
    }
}
