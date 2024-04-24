import { plainToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { Body, Controller, Put, Route } from 'tsoa';

import { UpdateStatementOfFactsCommand } from '../../../application-layer/drydock/statement-of-facts';
import { UpdateStatementOfFactsDto } from '../../../dal/drydock/statement-of-facts/UpdateStatementOfFactsDto';
import { MiddlewareHandler } from '../core/middleware/MiddlewareHandler';

async function updateStatementOfFact(req: Request, res: Response) {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async (request: Request) => {
        const dto = plainToClass(UpdateStatementOfFactsDto, request.body);

        const result = await new UpdateStatementOfFactsController().updateStatementOfFact(dto);

        return result;
    });
}

exports.put = updateStatementOfFact;

@Route('drydock/statement-of-facts/update-statement-of-fact')
export class UpdateStatementOfFactsController extends Controller {
    @Put()
    public async updateStatementOfFact(@Body() dto: UpdateStatementOfFactsDto): Promise<void> {
        const query = new UpdateStatementOfFactsCommand();

        const result = await query.ExecuteAsync(dto);

        return result;
    }
}
