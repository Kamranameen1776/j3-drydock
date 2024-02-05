import { Request, Response } from 'express';
import { Controller, Get, Route } from 'tsoa';

import { GetManagersQuery } from '../../../application-layer/drydock/dictionaries';
import { LibUserEntity } from '../../../entity/drydock';
import { MiddlewareHandler } from '../core/middleware/MiddlewareHandler';

async function getManagers(req: Request, res: Response) {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async () => {
        const result = await new GetManagersController().getManagers();

        return result;
    });
}

exports.get = getManagers;

// @Route('drydock/dictionaries/managers')
export class GetManagersController extends Controller {
    @Get()
    public async getManagers(): Promise<LibUserEntity[]> {
        const query = new GetManagersQuery();

        const result = await query.ExecuteAsync();

        return result;
    }
}
