import { YardsRepository } from '../../../dal/drydock/yards/YardsRepository';
import { Query } from '../core/cqrs/Query';
import { GetYardsDto } from './dtos/GetYardsDto';

export class GetYardsQuery extends Query<string, GetYardsDto[]> {
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
    protected async MainHandlerAsync(): Promise<GetYardsDto[]> {
        return this.yardsRepository.getYards();
    }
}
