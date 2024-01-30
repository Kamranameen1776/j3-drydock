import { Request, Response } from 'express';

import { name, version } from '../../../../package.json';
import { MiddlewareHandler } from '../core/middleware/MiddlewareHandler';
const timestamp = Date.now();
export async function getVersion(req: Request, res: Response) {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async () => {
        return {
            name,
            version,
            timestamp,
        };
    });
}

exports.get = getVersion;
