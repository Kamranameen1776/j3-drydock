import { Request, Response } from 'express';

import { MiddlewareHandler } from '../core/middleware/MiddlewareHandler';

export async function getHealth(req: Request, res: Response) {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async () => {
        //TODO: add database connection checkup.
        return {
            status: 'UP',
        };
    });
}

exports.get = getHealth;
