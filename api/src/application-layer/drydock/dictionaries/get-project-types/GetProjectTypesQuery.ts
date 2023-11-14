import { DictionariesRepository } from '../../../../dal/drydock/dictionaries/DictionariesRepository';
import { ProjectTypeEntity } from '../../../../entity/drydock/ProjectTypeEntity';
import { Query } from '../../core/cqrs/Query';

export class GetProjectTypesQuery extends Query<void, ProjectTypeEntity[]> {
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

    /**
     *
     * @returns All example projects, which were created after the latest projects date
     */
    protected async MainHandlerAsync(): Promise<ProjectTypeEntity[]> {
        const projects = await this.dictionariesRepository.GetProjectTypes();

        return projects;
    }
}
