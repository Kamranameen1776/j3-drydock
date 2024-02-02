import { UpdateResult } from 'typeorm';

import { StandardJobsRepository } from '../../../dal/drydock/standard-jobs/StandardJobsRepository';
import { Command } from '../core/cqrs/Command';
import { UnitOfWork } from '../core/uof/UnitOfWork';
import { DeleteStandardJobsRequestDto } from './dto';

export class DeleteStandardJobsCommand extends Command<DeleteStandardJobsRequestDto, UpdateResult> {
    standardJobsRepository: StandardJobsRepository;
    uow: UnitOfWork;

    constructor() {
        super();

        this.standardJobsRepository = new StandardJobsRepository();
        this.uow = new UnitOfWork();
    }

    protected async MainHandlerAsync(request: DeleteStandardJobsRequestDto) {
        return this.uow.ExecuteAsync(async (queryRunner) => {
            return this.standardJobsRepository.deleteStandardJob(request.uid, request.UserId, queryRunner);
        });
    }
}
