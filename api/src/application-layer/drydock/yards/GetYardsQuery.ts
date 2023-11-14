import { YardsRepository } from '../../../dal/drydock/yards/YardsRepository';
import { yards } from '../../../entity/yards';
import { Query } from '../core/cqrs/Query';

export class GetYardsQuery extends Query<string, yards> {
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
    protected async MainHandlerAsync(): Promise<yards> {
        return await this.yardsRepository.getYards();
    }
}
