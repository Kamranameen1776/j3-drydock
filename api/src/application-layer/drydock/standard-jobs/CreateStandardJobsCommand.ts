import { validateAgainstModel } from '../../../common/drydock/ts-helpers/validate-against-model';
import { StandardJobsRepository } from '../../../dal/drydock/standard-jobs/StandardJobsRepository';
import { StandardJobs } from '../../../entity/drydock';
import { Command } from '../core/cqrs/Command';
import { UnitOfWork } from '../core/uof/UnitOfWork';
import { CreateStandardJobsRequestDto } from './dto';

export class CreateStandardJobsCommand extends Command<CreateStandardJobsRequestDto, StandardJobs> {
    standardJobsRepository: StandardJobsRepository;
    uow: UnitOfWork;

    constructor() {
        super();

        this.standardJobsRepository = new StandardJobsRepository();
        this.uow = new UnitOfWork();
    }

    protected async ValidationHandlerAsync(request: CreateStandardJobsRequestDto): Promise<void> {
        await validateAgainstModel(CreateStandardJobsRequestDto, request);
    }

    protected async MainHandlerAsync(request: CreateStandardJobsRequestDto) {
        return this.uow.ExecuteAsync(async (queryRunner) => {
            return this.standardJobsRepository.createStandardJob(request, request.UserId, queryRunner);
        });
    }
}
