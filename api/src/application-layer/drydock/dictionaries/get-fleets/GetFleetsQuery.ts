import { DictionaryService } from '../../../../bll/drydock/dictionaries/DictionaryService';

import { DictionariesRepository } from '../../../../dal/drydock/dictionaries/DictionariesRepository';
import { Query } from '../../core/cqrs/Query';
import { GetFleetsResult } from "./GetFleetsResultDto";

export class GetFleetsQuery extends Query<void, GetFleetsResult[]> {
    dictionariesRepository: DictionariesRepository;
    dictionariesService: DictionaryService;

    constructor() {
        super();

        this.dictionariesRepository = new DictionariesRepository();
        this.dictionariesService = new DictionaryService();
    }

    protected async AuthorizationHandlerAsync(): Promise<void> {
        return;
    }

    protected async ValidationHandlerAsync(): Promise<void> {
        return;
    }

    protected async MainHandlerAsync(): Promise<GetFleetsResult[]> {
        return this.dictionariesRepository.GetFleets();
    }
}
