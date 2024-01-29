import { Request, Response } from 'express';
import { Body, Controller, Post } from 'tsoa';

import { GetStatementOfFactsQuery } from '../../../application-layer/drydock/statement-of-facts';
import { MiddlewareHandler } from '../../../controllers/drydock/core/middleware/MiddlewareHandler';
import { IStatementOfFactsDto } from '../../../dal/drydock/statement-of-facts/IStatementOfFactsDto';
import { ODataResult } from '../../../shared/interfaces';

/**
 * This handler returns all available shipments
 * GET /drydock/example-projects
 * @exports
 * @param {Request} req Express request
 * @param {Response} res Express response
 */
async function getProjectsForMainPageAction(req: Request, res: Response) {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async (request) => {
        const result = await new GetProjectsForMainPageController().getProjectsForMainPage(request);

        return result;
    });
}

exports.post = getProjectsForMainPageAction;

// @Route('drydock/statement-of-facts/get-statement-of-facts')
export class GetProjectsForMainPageController extends Controller {
    @Post()
    public async getProjectsForMainPage(@Body() request: Request): Promise<ODataResult<IStatementOfFactsDto>> {
        const query = new GetStatementOfFactsQuery();

        const result = await query.ExecuteAsync(request);

        return result;
    }
}
