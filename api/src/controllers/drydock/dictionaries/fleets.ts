import { Request, Response } from 'express';

import { MiddlewareHandler } from '../core/middleware/MiddlewareHandler';
import { GetFleetsQuery } from "../../../application-layer/drydock/dictionaries";

async function getVessels(req: Request, res: Response) {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async () => {
        const command = new GetFleetsQuery();
        
        return await command.ExecuteAsync();
    });
}

exports.get = getVessels;
