import { DictionaryService } from '../../../../bll/drydock/dictionaries/DictionaryService';

import { DictionariesRepository } from '../../../../dal/drydock/dictionaries/DictionariesRepository';
import { Query } from '../../core/cqrs/Query';

export class GetVesselsQuery extends Query<void, any[]> {
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

    /**
     *
     * @returns All example projects, which were created after the latest projects date
     */
    protected async MainHandlerAsync(): Promise<any[]> {
        
        const query = undefined;
        const projects = await this.dictionariesRepository.GetVessels();

        return projects;
    }
}
