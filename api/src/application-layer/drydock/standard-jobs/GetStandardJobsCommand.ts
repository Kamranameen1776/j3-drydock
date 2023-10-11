import { StandardJobsRepository } from '../../../dal/drydock/standard-jobs/StandardJobsRepository';
import { RequestWithOData } from "../../../shared/interfaces";
import { Command } from '../core/cqrs/Command';
import { GetStandardJobsResultDto } from './GetStandardJobsResultDto';
import { StandardJobsService } from '../../../bll/drydock/standard_jobs/standard-jobs.service';

export class GetStandardJobsCommand extends Command<RequestWithOData, GetStandardJobsResultDto> {
    standardJobsRepository = new StandardJobsRepository();
    standardJobsService = new StandardJobsService();

    constructor() {
        super();
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
    protected async AuthorizationHandlerAsync(request: RequestWithOData): Promise<void> {}

    protected async ValidationHandlerAsync(request: RequestWithOData): Promise<void> {
        if (!request) {
            throw new Error('Request is null');
        }
    }

    protected async MainHandlerAsync(request: RequestWithOData): Promise<GetStandardJobsResultDto> {
        const data = await this.standardJobsRepository.getStandardJobs(request);

        return this.standardJobsService.mapStandardJobsDataToDto(data);
    }
}
