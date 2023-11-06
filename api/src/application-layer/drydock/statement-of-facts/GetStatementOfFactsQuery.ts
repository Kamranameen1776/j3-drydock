import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { Request } from 'express';
import { ODataResult } from 'shared/interfaces';

import { StatementOfFactsRepository } from '../../../dal/drydock/statement-of-facts/StatementOfFactsRepository';
import { Query } from '../core/cqrs/Query';
import { GetStatementOfFactsDto } from './dtos/GetStatementOfFactsDto';

export class GetStatementOfFactsQuery extends Query<Request, ODataResult<any>> {
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
        const createProjectDto: GetStatementOfFactsDto = plainToClass(GetStatementOfFactsDto, request.body);
        const result = await validate(createProjectDto);
        if (result.length) {
            throw result;
        }
    }

    /**
     * @returns All specification details
     */
    protected async MainHandlerAsync(request: Request): Promise<ODataResult<any>> {
        const data = await this.repository.GetStatementOfFacts(request);
        return data;
    }
}
