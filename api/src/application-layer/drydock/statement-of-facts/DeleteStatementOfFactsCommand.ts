import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { Request } from 'express';

import { StatementOfFactsRepository } from '../../../dal/drydock/statement-of-facts/StatementOfFactsRepository';
import { Command } from '../core/cqrs/Command';
import { UnitOfWork } from '../core/uof/UnitOfWork';
import { DeleteStatementOfFactsDto } from './dtos/DeleteStatementOfFactsDto';

export class DeleteStatementsOfFactsCommand extends Command<Request, void> {
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

    protected async ValidationHandlerAsync(request: Request): Promise<void> {
        if (!request) {
            throw new Error('Request is null');
        }
        const deleteStatementOfFacts: DeleteStatementOfFactsDto = plainToClass(DeleteStatementOfFactsDto, request.body);
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
    protected async MainHandlerAsync(request: Request): Promise<void> {
        const deleteStatementOfFactsDto: DeleteStatementOfFactsDto = request.body as DeleteStatementOfFactsDto;

        await this.uow.ExecuteAsync(async (queryRunner) => {
            await this.repository.DeleteStatementOfFacts(deleteStatementOfFactsDto.uid, queryRunner);
            return;
        });

        return;
    }
}
