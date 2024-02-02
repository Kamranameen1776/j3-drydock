import { Request, Response } from 'express';

import { getPackage } from '../../shared/utils/misc';
import { MiddlewareHandler } from './core/middleware/MiddlewareHandler';

export async function getVersion(req: Request, res: Response) {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async () => {
        return {
            serviceVersion: process.env.npm_package_version || getPackage()?.version || '',
        };
    });
}

exports.get = getVersion;
