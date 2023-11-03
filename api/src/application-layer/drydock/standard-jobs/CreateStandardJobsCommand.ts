import { Command } from '../core/cqrs/Command';
import { UnitOfWork } from '../core/uof/UnitOfWork';
import { StandardJobsRepository } from '../../../dal/drydock/standard-jobs/StandardJobsRepository';
import { CreateStandardJobsRequestDto } from './dto';
import { AccessRights } from "j2utils";
import { Request } from "express";

export class CreateStandardJobsCommand extends Command<Request, string> {
    standardJobsRepository: StandardJobsRepository;
    uow: UnitOfWork;

    constructor() {
        super();

        this.standardJobsRepository = new StandardJobsRepository();
        this.uow = new UnitOfWork();
    }

    protected async MainHandlerAsync(request: Request) {
        const { UserUID: createdBy } = AccessRights.authorizationDecode(request);
        const body: CreateStandardJobsRequestDto = request.body;

        return this.uow.ExecuteAsync(async (queryRunner) => {
            return this.standardJobsRepository.createStandardJob(body, createdBy, queryRunner);
        });
    }
}
