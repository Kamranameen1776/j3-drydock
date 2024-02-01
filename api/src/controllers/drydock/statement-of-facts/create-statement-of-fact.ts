import { plainToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { Body, Controller, Post, Route } from 'tsoa';

import { CreateStatementsOfFactsCommand } from '../../../application-layer/drydock/statement-of-facts';
import { CreateStatementsOfFactsDto } from '../../../dal/drydock/statement-of-facts/CreateStatementsOfFactsDto';
import { MiddlewareHandler } from '../core/middleware/MiddlewareHandler';

async function createCreateStatementsOfFacts(req: Request, res: Response) {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async (request: Request) => {
        const dto = plainToClass(CreateStatementsOfFactsDto, request.body);

        const result = await new CreateStatementsOfFactsController().createCreateStatementsOfFacts(dto);

        return result;
    });
}

exports.post = createCreateStatementsOfFacts;

@Route('drydock/statement-of-facts/create-statement-of-fact')
export class CreateStatementsOfFactsController extends Controller {
    @Post()
    public async createCreateStatementsOfFacts(@Body() dto: CreateStatementsOfFactsDto): Promise<void> {
        const query = new CreateStatementsOfFactsCommand();

        const result = await query.ExecuteAsync(dto);

        return result;
    }
}
