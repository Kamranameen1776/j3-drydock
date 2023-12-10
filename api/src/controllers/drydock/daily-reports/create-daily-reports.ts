import { Request, Response } from 'express';

import { CreateDailyReportsCommand } from '../../../application-layer/drydock/daily-reports/CreateDailyReportsCommand';
import { MiddlewareHandler } from '../core/middleware/MiddlewareHandler';

async function createDailyReports(req: Request, res: Response) {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async (request: Request) => {
        const command = new CreateDailyReportsCommand();

        return command.ExecuteAsync(request);
    });
}

exports.post = createDailyReports;
