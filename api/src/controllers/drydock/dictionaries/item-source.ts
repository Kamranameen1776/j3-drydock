import { Request, Response } from 'express';

import { GetItemSourcesQuery } from '../../../application-layer/drydock/dictionaries/get-item-sources/GetItemSourcesQuery';
import { MiddlewareHandler } from '../core/middleware/MiddlewareHandler';

async function getItemSource(req: Request, res: Response) {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async () => {
        const command = new GetItemSourcesQuery();

        return command.ExecuteAsync();
    });
}

exports.get = getItemSource;
