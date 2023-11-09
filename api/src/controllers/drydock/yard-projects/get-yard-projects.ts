import { Request, Response } from 'express';

import { GetYardProjectsQuery } from '../../../application-layer/drydock/yard-projects/GetYardProjectsQuery';
import { MiddlewareHandler } from '../core/middleware/MiddlewareHandler';

/**
 * @exports
 * @param {Request} req Express request
 * @param {Response} res Express response
 */
export async function getYardProjects(req: Request, res: Response) {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async (request: Request) => {
        const query = new GetYardProjectsQuery();

        const uid = request.query.uid as string;
        const result = await query.ExecuteAsync(uid);

        return result;
    });
}

exports.get = getYardProjects;
