import { Request } from 'express';
import { AccessRights } from 'j2utils';

import { StandardJobsRepository } from '../../../dal/drydock/standard-jobs/StandardJobsRepository';
import { StandardJobs } from '../../../entity/drydock';
import { Command } from '../core/cqrs/Command';
import { UnitOfWork } from '../core/uof/UnitOfWork';
import { CreateStandardJobsRequestDto } from './dto';

export class CreateStandardJobsCommand extends Command<Request, StandardJobs> {
    standardJobsRepository: StandardJobsRepository;
    uow: UnitOfWork;
    private readonly startNumber = 1000;
    private readonly codePrefix = 'SJ';

    constructor() {
        super();

        this.standardJobsRepository = new StandardJobsRepository();
        this.uow = new UnitOfWork();
    }

    protected async MainHandlerAsync(request: Request) {
        const { UserUID: createdBy } = AccessRights.authorizationDecode(request);
        const body: CreateStandardJobsRequestDto = request.body;

        return this.uow.ExecuteAsync(async (queryRunner) => {
            const runningNumber = await this.getRunningNumber(body.functionUid);
            body.number = runningNumber;
            body.code = `${this.codePrefix} - ${runningNumber}`;

            return this.standardJobsRepository.createStandardJob(body, createdBy, queryRunner);
        });
    }

    private async getRunningNumber(functionUid: string): Promise<number> {
        let runningNumber = await this.standardJobsRepository.getStandardJobRunningNumber(functionUid);

        if (runningNumber) {
            runningNumber++;
        } else {
            runningNumber = this.startNumber;
        }
        return runningNumber;
    }
}
