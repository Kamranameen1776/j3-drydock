import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

import { StatementOfFactsRepository } from '../../../dal/drydock/statement-of-facts/StatementOfFactsRepository';
import { Command } from '../core/cqrs/Command';
import { UnitOfWork } from '../core/uof/UnitOfWork';
import { DeleteStatementOfFactDto } from './dtos/DeleteStatementOfFactDto';

export class DeleteStatementsOfFactsCommand extends Command<DeleteStatementOfFactDto, void> {
    repository: StatementOfFactsRepository;
    uow: UnitOfWork;

    constructor() {
        super();
        this.repository = new StatementOfFactsRepository();
        this.uow = new UnitOfWork();
    }

    protected async AuthorizationHandlerAsync(): Promise<void> {
        return;
    }

    protected async ValidationHandlerAsync(request: DeleteStatementOfFactDto): Promise<void> {
        if (!request) {
            throw new Error('Request is null');
        }

        const deleteStatementOfFacts: DeleteStatementOfFactDto = plainToClass(DeleteStatementOfFactDto, request);

        const result = await validate(deleteStatementOfFacts);

        if (result.length) {
            throw result;
        }
    }

    /**
     *
     * @param request Project data for creation of the new project
     * @returns New created project result
     */
    protected async MainHandlerAsync(request: DeleteStatementOfFactDto): Promise<void> {
        await this.uow.ExecuteAsync(async (queryRunner) => {
            await this.repository.DeleteStatementOfFacts(request.StatementOfFactUid, queryRunner);
        });
    }
}
