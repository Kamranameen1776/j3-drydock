import { plainToClass } from 'class-transformer';
import { Request, Response } from 'express';

import { CreateStatementsOfFactsCommand } from '../../../application-layer/drydock/statement-of-facts';
import { CreateStatementsOfFactsDto } from '../../../dal/drydock/statement-of-facts/CreateStatementsOfFactsDto';
import { MiddlewareHandler } from '../core/middleware/MiddlewareHandler';

async function createCreateStatementsOfFacts(req: Request, res: Response) {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async (request: Request) => {
        const command = new CreateStatementsOfFactsCommand();

        return command.ExecuteAsync(plainToClass(CreateStatementsOfFactsDto, request.body));
    });
}

exports.post = createCreateStatementsOfFacts;
