import { plainToClass } from 'class-transformer';
import { Request, Response } from 'express';

import { UpdateStatementOfFactsCommand } from '../../../application-layer/drydock/statement-of-facts';
import { UpdateStatementOfFactsDto } from '../../../dal/drydock/statement-of-facts/UpdateStatementOfFactsDto';
import { MiddlewareHandler } from '../core/middleware/MiddlewareHandler';

async function updateStatementOfFact(req: Request, res: Response) {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async (request: Request) => {
        const command = new UpdateStatementOfFactsCommand();

        return command.ExecuteAsync(plainToClass(UpdateStatementOfFactsDto, request.body));
    });
}

exports.put = updateStatementOfFact;
