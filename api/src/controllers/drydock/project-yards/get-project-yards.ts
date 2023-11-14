import { Request, Response } from 'express';

import { GetProjectYardsQuery } from '../../../application-layer/drydock/project-yards/GetProjectYardsQuery';
import { MiddlewareHandler } from '../core/middleware/MiddlewareHandler';

/**
 * @exports
 * @param {Request} req Express request
 * @param {Response} res Express response
 */
export async function getProjectYards(req: Request, res: Response) {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async (request: Request) => {
        const query = new GetProjectYardsQuery();

        const uid = request.query.uid as string;
        const result = await query.ExecuteAsync(uid);

        return result;
    });
}

exports.get = getProjectYards;
