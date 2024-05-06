import { StandardJobsRepository } from '../../../dal/drydock/standard-jobs/StandardJobsRepository';
import { StandardJobs } from '../../../entity/drydock';
import { Command } from '../core/cqrs/Command';
import { UnitOfWork } from '../core/uof/UnitOfWork';
import { UpdateStandardJobsRequestDto } from './dto';

export class UpdateStandardJobsCommand extends Command<UpdateStandardJobsRequestDto, StandardJobs> {
    standardJobsRepository: StandardJobsRepository;
    uow: UnitOfWork;

    constructor() {
        super();

        this.standardJobsRepository = new StandardJobsRepository();
        this.uow = new UnitOfWork();
    }

    public async MainHandlerAsync(request: UpdateStandardJobsRequestDto) {
        return this.uow.ExecuteAsync(async (queryRunner) => {
            return this.standardJobsRepository.updateStandardJob(request, request.UserId, queryRunner);
        });
    }
}
