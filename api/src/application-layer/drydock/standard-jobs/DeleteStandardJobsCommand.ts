import { Request } from 'express';
import { AccessRights } from 'j2utils';
import { UpdateResult } from 'typeorm';

import { StandardJobsRepository } from '../../../dal/drydock/standard-jobs/StandardJobsRepository';
import { Command } from '../core/cqrs/Command';
import { UnitOfWork } from '../core/uof/UnitOfWork';
import { DeleteStandardJobsRequestDto } from './dto';

export class DeleteStandardJobsCommand extends Command<Request, UpdateResult> {
    standardJobsRepository: StandardJobsRepository;
    uow: UnitOfWork;

    constructor() {
        super();

        this.standardJobsRepository = new StandardJobsRepository();
        this.uow = new UnitOfWork();
    }

    protected async MainHandlerAsync(request: Request) {
        const { UserUID: deletedBy } = AccessRights.authorizationDecode(request);
        const body: DeleteStandardJobsRequestDto = request.body;
        const uid = body.uid;

        return this.uow.ExecuteAsync(async (queryRunner) => {
            return this.standardJobsRepository.deleteStandardJob(uid, deletedBy, queryRunner);
        });
    }
}
