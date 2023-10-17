import { Command } from '../core/cqrs/Command';
import { UnitOfWork } from '../core/uof/UnitOfWork';
import { StandardJobsRepository } from '../../../dal/drydock/standard-jobs/StandardJobsRepository';
import { UpdateStandardJobsRequestDto } from "./dto";
import { AccessRights } from "j2utils";
import { Request } from "express";

export class UpdateStandardJobsCommand extends Command<Request, string> {
    standardJobsRepository: StandardJobsRepository;
    uow: UnitOfWork;

    constructor() {
        super();

        this.standardJobsRepository = new StandardJobsRepository();
        this.uow = new UnitOfWork();
    }

    protected async MainHandlerAsync(request: Request) {
        const { UserUID: updatedBy } = AccessRights.authorizationDecode(request);
        const body: UpdateStandardJobsRequestDto = request.body;

        return this.uow.ExecuteAsync(async (queryRunner) => {
            return this.standardJobsRepository.updateStandardJob(body, updatedBy, queryRunner);
        });
    }
}
