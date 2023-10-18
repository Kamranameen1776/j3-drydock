import { StandardJobsRepository } from '../../../dal/drydock/standard-jobs/StandardJobsRepository';
import { Command } from '../core/cqrs/Command';
import { Request } from "express";
import { BusinessException } from "../../../bll/drydock/core/exceptions/BusinessException";
import { StandardJobsService } from "../../../bll/drydock/standard_jobs/standard-jobs.service";
import {
    AllowedStandardJobsFiltersKeys,
    StandardJobsFiltersAllowedKeys
} from "./dto/GetStandardJobsFiltersRequestDto";

export class GetStandardJobsFiltersCommand extends Command<Request, string[]> {
    standardJobsRepository = new StandardJobsRepository();
    standardJobsService = new StandardJobsService();

    constructor() {
        super();
    }

    protected async ValidationHandlerAsync(request: Request): Promise<void> {
        const key = request.body.key;
        if (!key) {
            throw new BusinessException("Key is required");
        }

        if (!Object.values(AllowedStandardJobsFiltersKeys).includes(key)) {
            throw new BusinessException("Invalid key");
        }
    }

    protected async MainHandlerAsync(request: Request): Promise<string[]> {
        const key: StandardJobsFiltersAllowedKeys = request.body.key;
        const data = await this.standardJobsRepository.getStandardJobFilters(key);

        return this.standardJobsService.getFilterValues(data, key);
    }
}
