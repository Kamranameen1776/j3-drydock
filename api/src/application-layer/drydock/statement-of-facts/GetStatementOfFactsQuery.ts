import { validate } from 'class-validator';

import { IStatementOfFactsDto } from '../../../dal/drydock/statement-of-facts/IStatementOfFactsDto';
import { StatementOfFactsRepository } from '../../../dal/drydock/statement-of-facts/StatementOfFactsRepository';
import { ODataResult } from '../../../shared/interfaces/odata-result.interface';
import { OdataRequest } from '../core/cqrs/odata/OdataRequest';
import { Query } from '../core/cqrs/Query';

export class GetStatementOfFactsQuery extends Query<OdataRequest, ODataResult<IStatementOfFactsDto>> {
    repository: StatementOfFactsRepository;

    constructor() {
        super();
        this.repository = new StatementOfFactsRepository();
    }

    protected async AuthorizationHandlerAsync(): Promise<void> {
        return;
    }

    protected async ValidationHandlerAsync(request: OdataRequest): Promise<void> {
        if (!request) {
            throw new Error('Request is null');
        }
        const result = await validate(request.odataBody);
        if (result.length) {
            throw result;
        }
    }

    /**
     * @returns All specification details
     */
    protected async MainHandlerAsync(request: OdataRequest): Promise<ODataResult<IStatementOfFactsDto>> {
        const data = await this.repository.GetStatementOfFacts(request.request);

        return data;
    }
}
