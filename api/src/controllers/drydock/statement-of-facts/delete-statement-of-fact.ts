import { Request, Response } from 'express';

import { DeleteStatementsOfFactsCommand } from '../../../application-layer/drydock/statement-of-facts';
import { DeleteStatementOfFactDto } from '../../../application-layer/drydock/statement-of-facts/dtos/DeleteStatementOfFactDto';
import { MiddlewareHandler } from '../core/middleware/MiddlewareHandler';

async function deleteStatementOfFact(req: Request, res: Response) {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async (request: Request) => {
        const command = new DeleteStatementsOfFactsCommand();

        return command.ExecuteAsync(request.body as DeleteStatementOfFactDto);
    });
}

exports.post = deleteStatementOfFact;
