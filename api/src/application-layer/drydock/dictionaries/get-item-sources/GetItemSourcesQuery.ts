import { DictionariesRepository } from '../../../../dal/drydock/dictionaries/DictionariesRepository';
import { LibItemSourceEntity } from '../../../../entity/drydock';
import { Query } from '../../core/cqrs/Query';

export class GetItemSourcesQuery extends Query<void, LibItemSourceEntity[]> {
    dictionariesRepository: DictionariesRepository;

    constructor() {
        super();

        this.dictionariesRepository = new DictionariesRepository();
    }

    protected async AuthorizationHandlerAsync(): Promise<void> {
        return;
    }

    protected async ValidationHandlerAsync(): Promise<void> {
        return;
    }

    protected async MainHandlerAsync(): Promise<LibItemSourceEntity[]> {
        const itemSources = await this.dictionariesRepository.GetItemSources();

        return itemSources;
    }
}
