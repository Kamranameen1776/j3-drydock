import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { Request } from 'express';

import { StatementOfFactsRepository } from '../../../dal/drydock/statement-of-facts/StatementOfFactsRepository';
import { Command } from '../core/cqrs/Command';
import { UnitOfWork } from '../core/uof/UnitOfWork';
import { CreateStatementsOfFactsDto } from './dtos/CreateStatementsOfFactsDto';

export class CreateStatementsOfFactsCommand extends Command<Request, void> {
    repository: StatementOfFactsRepository;
    uow: UnitOfWork;

    constructor() {
        super();
        this.repository = new StatementOfFactsRepository();
        this.uow = new UnitOfWork();
    }

    protected async AuthorizationHandlerAsync(request: Request): Promise<void> {
        return;
    }

    protected async ValidationHandlerAsync(request: Request): Promise<void> {
        if (!request) {
            throw new Error('Request is null');
        }
        const createProjectDto: CreateStatementsOfFactsDto = plainToClass(CreateStatementsOfFactsDto, request.body);
        const result = await validate(createProjectDto);
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
        const createProjectDto: CreateStatementsOfFactsDto = request.body as CreateStatementsOfFactsDto;

        await this.uow.ExecuteAsync(async (queryRunner) => {
            await this.repository.CreateStatementOfFacts(createProjectDto, queryRunner);
            return;
        });

        return;
    }
}
