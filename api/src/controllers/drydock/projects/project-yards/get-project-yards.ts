import { Request, Response } from 'express';
import { Controller, Get, Query, Route } from 'tsoa';

import { GetProjectYardsResultDto } from '../../../../application-layer/drydock/projects/project-yards/dtos/GetProjectYardsResultDto';
import { GetProjectYardsQuery } from '../../../../application-layer/drydock/projects/project-yards/GetProjectYardsQuery';
import { MiddlewareHandler } from '../../core/middleware/MiddlewareHandler';

/**
 * @exports
 * @param {Request} req Express request
 * @param {Response} res Express response
 */
export async function getProjectYards(req: Request, res: Response) {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async (request: Request) => {
        const uid = request.query.uid as string;

        const result = await new GetProjectYardsController().getProjectYards(uid);

        return result;
    });
}

exports.get = getProjectYards;

// @Route('drydock/projects/project-yards/get-project-yards')
export class GetProjectYardsController extends Controller {
    @Get()
    public async getProjectYards(@Query() uid: string): Promise<GetProjectYardsResultDto[]> {
        const query = new GetProjectYardsQuery();

        const result = await query.ExecuteAsync(uid);

        return result;
    }
}
