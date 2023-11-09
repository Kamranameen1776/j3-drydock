import { StandardJobsRepository } from '../../../dal/drydock/standard-jobs/StandardJobsRepository';
import { RequestWithOData } from "../../../shared/interfaces";
import { Command } from '../core/cqrs/Command';
import { GetStandardJobsResultDto } from './dto';
import { StandardJobsService } from '../../../bll/drydock/standard_jobs/standard-jobs.service';

export class GetStandardJobsCommand extends Command<RequestWithOData, GetStandardJobsResultDto> {
    standardJobsRepository = new StandardJobsRepository();
    standardJobsService = new StandardJobsService();

    constructor() {
        super();
    }

    protected async MainHandlerAsync(request: RequestWithOData): Promise<GetStandardJobsResultDto> {
        const data = await this.standardJobsRepository.getStandardJobs(request);

        const uids = data.records.map(item => item.uid);

        const subItems = await this.standardJobsRepository.getStandardJobSubItems(uids);

        return this.standardJobsService.mapStandardJobsDataToDto(data, subItems);
    }
}
