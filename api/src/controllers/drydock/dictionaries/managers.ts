import { Request, Response } from 'express';

import { GetManagersQuery } from '../../../application-layer/drydock/dictionaries';
import { MiddlewareHandler } from '../core/middleware/MiddlewareHandler';

async function getManagers(req: Request, res: Response) {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async () => {
        const command = new GetManagersQuery();

        return command.ExecuteAsync();
    });
}

exports.get = getManagers;
