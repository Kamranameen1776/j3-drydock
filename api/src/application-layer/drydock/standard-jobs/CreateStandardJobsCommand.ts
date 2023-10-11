import { Command } from '../core/cqrs/Command';
import { UnitOfWork } from '../core/uof/UnitOfWork';
import { StandardJobsRepository } from '../../../dal/drydock/standard-jobs/StandardJobsRepository';
import { CreateStandardJobsRequestDto } from './CreateStandardJobsRequestDto';

export class CreateStandardJobsCommand extends Command<CreateStandardJobsRequestDto, string> {
    standardJobsRepository: StandardJobsRepository;
    uow: UnitOfWork;

    constructor() {
        super();

        this.standardJobsRepository = new StandardJobsRepository();
        this.uow = new UnitOfWork();
    }

    protected async AuthorizationHandlerAsync(request: CreateStandardJobsRequestDto) {}

    protected async ValidationHandlerAsync(request: CreateStandardJobsRequestDto) {
        if (!request) {
            throw new Error('Request is null');
        }
    }

    protected async MainHandlerAsync(request: CreateStandardJobsRequestDto) {
        return this.uow.ExecuteAsync(async (queryRunner) => {
            return this.standardJobsRepository.createStandardJob(request, queryRunner);
        });
    }
}
