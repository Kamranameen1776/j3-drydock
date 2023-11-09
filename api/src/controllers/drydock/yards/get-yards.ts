import { Request, Response } from 'express';

import { GetYardsQuery } from '../../../application-layer/drydock/yards/GetYardsQuery';
import { MiddlewareHandler } from '../core/middleware/MiddlewareHandler';

/**
 * @exports
 * @param {Request} req Express request
 * @param {Response} res Express response
 */
export async function getYards(req: Request, res: Response) {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async (request: Request) => {
        const query = new GetYardsQuery();

        const uid = request.query.uid as string;
        const yardToProjectList = await query.ExecuteAsync(uid);

        return yardToProjectList;
    });
}

exports.get = getYards;
