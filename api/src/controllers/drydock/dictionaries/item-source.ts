import { Request, Response } from 'express';
import { Controller, Get, Route } from 'tsoa';

import { GetItemSourcesQuery } from '../../../application-layer/drydock/dictionaries/get-item-sources/GetItemSourcesQuery';
import { LibItemSourceEntity } from '../../../entity/drydock';
import { MiddlewareHandler } from '../core/middleware/MiddlewareHandler';

async function getItemSource(req: Request, res: Response) {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async () => {
        const result = await new GetItemSourceController().getItemSource();

        return result;
    });
}

exports.get = getItemSource;

// @Route('drydock/dictionaries/item-source')
export class GetItemSourceController extends Controller {
    @Get()
    public async getItemSource(): Promise<LibItemSourceEntity[]> {
        const query = new GetItemSourcesQuery();

        const result = await query.ExecuteAsync();

        return result;
    }
}
