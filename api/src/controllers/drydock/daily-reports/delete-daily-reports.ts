import { Request, Response } from 'express';

import { DeleteDailyReportsCommand } from '../../../application-layer/drydock/daily-reports/DeleteDailyReportsCommand';
import { MiddlewareHandler } from '../core/middleware/MiddlewareHandler';

async function deleteDailyReports(req: Request, res: Response) {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async (request: Request) => {
        const command = new DeleteDailyReportsCommand();

        return command.ExecuteAsync(request.body);
    });
}

exports.put = deleteDailyReports;
