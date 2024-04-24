import { StandardJobsRepository } from '../../../dal/drydock/standard-jobs/StandardJobsRepository';
import { Command } from '../core/cqrs/Command';
import { UnitOfWork } from '../core/uof/UnitOfWork';
import { UpdateStandardJobSubItemsRequestDto } from './dto/UpdateStandardJobSubItemsRequestDto';

export class UpdateStandardJobSubItemsCommand extends Command<UpdateStandardJobSubItemsRequestDto, void> {
    standardJobsRepository: StandardJobsRepository;
    uow: UnitOfWork;

    constructor() {
        super();

        this.standardJobsRepository = new StandardJobsRepository();
        this.uow = new UnitOfWork();
    }

    protected async MainHandlerAsync(request: UpdateStandardJobSubItemsRequestDto) {
        return this.uow.ExecuteAsync(async (queryRunner) => {
            return this.standardJobsRepository.updateStandardJobSubItems(request, request.UserUID, queryRunner);
        });
    }
}
