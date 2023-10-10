import { StandardJobsRepository } from '../../../dal/drydock/standard-jobs/StandardJobsRepository';
import { RequestWithOData } from '../../../shared/interfaces/request-with-odata.interface';
import { Command } from '../core/cqrs/Command';
import { UnitOfWork } from '../core/uof/UnitOfWork';
import { GetStandardJobsResultDto } from './GetStandardJobsResultDto';

export class GetStandardJobsCommand extends Command<RequestWithOData, GetStandardJobsResultDto> {
    standardJobsRepository: StandardJobsRepository;
    uow: UnitOfWork;

    constructor() {
        super();

        this.standardJobsRepository = new StandardJobsRepository();
        this.uow = new UnitOfWork();
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
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
