import { Request, Response } from 'express';

import { UpdateStatementOfFactsCommand } from '../../../application-layer/drydock/statement-of-facts';
import { MiddlewareHandler } from '../core/middleware/MiddlewareHandler';

async function updateStatementOfFacts(req: Request, res: Response) {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async (request: Request) => {
        const command = new UpdateStatementOfFactsCommand();

        return command.ExecuteAsync(request);
    });
}

exports.put = updateStatementOfFacts;
