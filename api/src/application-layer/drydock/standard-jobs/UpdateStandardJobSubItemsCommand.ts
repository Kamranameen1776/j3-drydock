import { Request } from 'express';
import { AccessRights } from 'j2utils';

import { StandardJobsRepository } from '../../../dal/drydock/standard-jobs/StandardJobsRepository';
import { Command } from '../core/cqrs/Command';
import { UnitOfWork } from '../core/uof/UnitOfWork';
import { UpdateStandardJobSubItemsRequestDto } from './dto/UpdateStandardJobSubItemsRequestDto';

export class UpdateStandardJobSubItemsCommand extends Command<Request, void> {
    standardJobsRepository: StandardJobsRepository;
    uow: UnitOfWork;

    constructor() {
        super();

        this.standardJobsRepository = new StandardJobsRepository();
        this.uow = new UnitOfWork();
    }

    protected async MainHandlerAsync(request: Request) {
        const { UserUID: updatedBy } = AccessRights.authorizationDecode(request);
        const body: UpdateStandardJobSubItemsRequestDto = request.body;

        return this.uow.ExecuteAsync(async (queryRunner) => {
            return this.standardJobsRepository.updateStandardJobSubItems(body, updatedBy, queryRunner);
        });
    }
}
