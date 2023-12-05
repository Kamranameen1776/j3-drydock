import { Query } from 'application-layer/drydock/core/cqrs/Query';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { Request } from 'express';
import { ODataResult } from 'shared/interfaces';

import { GetJobOrdersDto } from './dtos/GetJobOrdersDto';

export class GetStatementOfFactsQuery extends Query<Request, ODataResult<IStatementOfFactsDto>> {
    repository: StatementOfFactsRepository;

    constructor() {
        super();
        this.repository = new StatementOfFactsRepository();
    }

    protected async AuthorizationHandlerAsync(): Promise<void> {
        return;
    }

    protected async ValidationHandlerAsync(request: Request): Promise<void> {
        if (!request) {
            throw new Error('Request is null');
        }
        const createProjectDto: GetJobOrdersDto = plainToClass(GetStatementOfFactsDto, request.body);
        const result = await validate(createProjectDto);
        if (result.length) {
            throw result;
        }
    }

    /**
     * @returns All specification details
     */
    protected async MainHandlerAsync(request: Request): Promise<ODataResult<IStatementOfFactsDto>> {
        const data = await this.repository.GetStatementOfFacts(request);

        return data;
    }
}
