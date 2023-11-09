import { YardsRepository } from '../../../dal/drydock/yards/YardsRepository';
import { YardsEntity } from '../../../entity/yards';
import { Query } from '../core/cqrs/Query';

export class GetYardsQuery extends Query<string, YardsEntity> {
    yardsRepository = new YardsRepository();

    protected async AuthorizationHandlerAsync(): Promise<void> {
        return;
    }

    protected async ValidationHandlerAsync(): Promise<void> {
        return;
    }

    /**
     * @returns All yard details
     */
    protected async MainHandlerAsync(): Promise<YardsEntity> {
        return await this.yardsRepository.getYards();
    }
}
