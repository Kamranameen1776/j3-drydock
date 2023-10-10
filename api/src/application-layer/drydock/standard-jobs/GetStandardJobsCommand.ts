import { Command } from '../core/cqrs/Command';
import { UnitOfWork } from '../core/uof/UnitOfWork';
import { StandardJobsRepository } from '../../../dal/drydock/standard-jobs/StandardJobsRepository';
import { GetStandardJobsResultDto } from "./GetStandardJobsResultDto";
import { RequestWithOData } from "../../../shared/interfaces/request-with-odata.interface";

export class GetStandardJobsCommand extends Command<RequestWithOData, GetStandardJobsResultDto> {
    standardJobsRepository: StandardJobsRepository;
    uow: UnitOfWork;

    constructor() {
        super();

        this.standardJobsRepository = new StandardJobsRepository();
        this.uow = new UnitOfWork();
    }

    protected async AuthorizationHandlerAsync(request: RequestWithOData): Promise<void> {}

    protected async ValidationHandlerAsync(request: RequestWithOData): Promise<void> {
        if (!request) {
            throw new Error('Request is null');
        }
    }

    protected async MainHandlerAsync(request: RequestWithOData): Promise<GetStandardJobsResultDto> {
        return this.standardJobsRepository.getStandardJobs(request);
    }
}
