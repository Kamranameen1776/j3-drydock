import { Request, Response } from 'express';
import { Controller, Get, Query, Route } from 'tsoa';

import { GetYardsDto } from '../../../application-layer/drydock/yards/dtos/GetYardsDto';
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
        const uid = request.query.uid as string;

        const result = await new GetYardsController().getYards(uid);

        return result;
    });
}

exports.get = getYards;

@Route('drydock/yards/get-yards')
export class GetYardsController extends Controller {
    @Get()
    public async getYards(@Query() uid: string): Promise<GetYardsDto[]> {
        const query = new GetYardsQuery();

        const result = await query.ExecuteAsync(uid);

        return result;
    }
}
