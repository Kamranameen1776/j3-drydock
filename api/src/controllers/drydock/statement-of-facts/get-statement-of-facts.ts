import * as express from 'express';
import { Body, Controller, Post, Request, Route } from 'tsoa';

import { GetStatementOfFactsQuery } from '../../../application-layer/drydock/statement-of-facts';
import { Req } from '../../../common/drydock/ts-helpers/req-res';
import { MiddlewareHandler } from '../../../controllers/drydock/core/middleware/MiddlewareHandler';
import { IStatementOfFactsDto } from '../../../dal/drydock/statement-of-facts/IStatementOfFactsDto';
import { ODataBodyDto } from '../../../shared/dto';
import { ODataResult } from '../../../shared/interfaces';

async function getStatementsOfFact(req: express.Request, res: express.Response) {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async (request) => {
        const result = await new GetStatementsOfFactController().getStatementsOfFact(request, req.body.odata);

        return result;
    });
}

exports.post = getStatementsOfFact;

// @Route('drydock/statement-of-facts/get-statement-of-facts')
export class GetStatementsOfFactController extends Controller {
    @Post()
    public async getStatementsOfFact(
        @Request() request: Req<ODataBodyDto>,
        @Body() odataBody: ODataBodyDto,
    ): Promise<ODataResult<IStatementOfFactsDto>> {
        const query = new GetStatementOfFactsQuery();

        const result = await query.ExecuteAsync(request, ODataBodyDto);

        return result;
    }
}
