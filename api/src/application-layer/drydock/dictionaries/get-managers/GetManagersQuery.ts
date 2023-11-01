import { DictionariesRepository } from '../../../../dal/drydock/dictionaries/DictionariesRepository';
import { LibUserEntity } from '../../../../entity/drydock/dbo/LibUserEntity';
import { Query } from '../../core/cqrs/Query';

export class GetManagersQuery extends Query<void, LibUserEntity[]> {
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
    protected async MainHandlerAsync(): Promise<LibUserEntity[]> {
        const query = undefined;
        const projects = await this.dictionariesRepository.GetManagers();

        //TODO: think how to change it, Entity.get FullName() didnt work, take a look on other
        return projects.map((item) => {
            return {
                ...item,
                FullName: `${item.FirstName} ${item.LastName}`,
            };
        });
    }
}
