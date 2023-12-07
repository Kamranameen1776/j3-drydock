import { Request, Response } from 'express';

import { UpdateDailyReportsCommand } from '../../../application-layer/drydock/daily-reports/UpdateDailyReportsCommand';
import { MiddlewareHandler } from '../core/middleware/MiddlewareHandler';

async function updateDailyReports(req: Request, res: Response) {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async (request: Request) => {
        const command = new UpdateDailyReportsCommand();

        return command.ExecuteAsync(request.body);
    });
}

exports.put = updateDailyReports;
