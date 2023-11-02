import { Request, Response } from 'express';

import { GetManagersQuery } from '../../../application-layer/drydock/dictionaries';
import { MiddlewareHandler } from '../core/middleware/MiddlewareHandler';

async function getManagers(req: Request, res: Response) {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async (request: Request) => {
        const command = new GetManagersQuery();

        return await command.ExecuteAsync();
    });
}

exports.get = getManagers;
