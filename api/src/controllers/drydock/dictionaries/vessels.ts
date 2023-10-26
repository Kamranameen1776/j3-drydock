import { Request, Response } from 'express';

import { GetVesselsQuery } from '../../../application-layer/drydock/dictionaries';
import { MiddlewareHandler } from '../core/middleware/MiddlewareHandler';

async function getVessels(req: Request, res: Response) {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async (request: Request) => {
        const command = new GetVesselsQuery();
        
        return await command.ExecuteAsync();
    });
}

exports.get = getVessels;
