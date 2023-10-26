import { Request, Response } from 'express';

import { GetProjectTypesQuery } from '../../../application-layer/drydock/dictionaries';
import { MiddlewareHandler } from '../core/middleware/MiddlewareHandler';

async function getProjectTypes(req: Request, res: Response) {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async (request: Request) => {
        const command = new GetProjectTypesQuery();
        
        return await command.ExecuteAsync();
    });
}

exports.get = getProjectTypes;
