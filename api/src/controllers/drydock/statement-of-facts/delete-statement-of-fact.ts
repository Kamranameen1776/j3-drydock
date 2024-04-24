import { plainToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { Body, Controller, Post, Route } from 'tsoa';

import { DeleteStatementsOfFactsCommand } from '../../../application-layer/drydock/statement-of-facts';
import { DeleteStatementOfFactDto } from '../../../application-layer/drydock/statement-of-facts/dtos/DeleteStatementOfFactDto';
import { MiddlewareHandler } from '../core/middleware/MiddlewareHandler';

async function deleteStatementOfFact(req: Request, res: Response) {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async (request: Request) => {
        const dto = plainToClass(DeleteStatementOfFactDto, request.body);

        const result = await new DeleteStatementsOfFactsController().deleteStatementOfFact(dto);

        return result;
    });
}

exports.post = deleteStatementOfFact;

@Route('drydock/statement-of-facts/delete-statement-of-fact')
export class DeleteStatementsOfFactsController extends Controller {
    @Post()
    public async deleteStatementOfFact(@Body() dto: DeleteStatementOfFactDto): Promise<void> {
        const query = new DeleteStatementsOfFactsCommand();

        const result = await query.ExecuteAsync(dto);

        return result;
    }
}
