import { validate } from 'class-validator';

import { Req } from '../../../common/drydock/ts-helpers/req-res';
import { IStatementOfFactsDto } from '../../../dal/drydock/statement-of-facts/IStatementOfFactsDto';
import { StatementOfFactsRepository } from '../../../dal/drydock/statement-of-facts/StatementOfFactsRepository';
import { ODataBodyDto } from '../../../shared/dto';
import { ODataResult } from '../../../shared/interfaces/odata-result.interface';
import { Query } from '../core/cqrs/Query';

export class GetStatementOfFactsQuery extends Query<Req<ODataBodyDto>, ODataResult<IStatementOfFactsDto>> {
    repository: StatementOfFactsRepository;

    constructor() {
        super();
        this.repository = new StatementOfFactsRepository();
    }

    protected async AuthorizationHandlerAsync(): Promise<void> {
        return;
    }

    protected async ValidationHandlerAsync(request: Req<ODataBodyDto>): Promise<void> {
        if (!request) {
            throw new Error('Request is null');
        }
        const result = await validate(request.body.odata);
        if (result.length) {
            throw result;
        }
    }

    /**
     * @returns All specification details
     */
    protected async MainHandlerAsync(request: Req<ODataBodyDto>): Promise<ODataResult<IStatementOfFactsDto>> {
        const data = await this.repository.GetStatementOfFacts(request);

        return data;
    }
}
