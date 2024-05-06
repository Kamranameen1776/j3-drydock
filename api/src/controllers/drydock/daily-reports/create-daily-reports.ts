import { plainToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { AccessRights } from 'j2utils';
import { Body, Controller, Post, Route } from 'tsoa';

import { CreateDailyReportsCommand } from '../../../application-layer/drydock/daily-reports/CreateDailyReportsCommand';
import { MiddlewareHandler } from '../core/middleware/MiddlewareHandler';
import { CreateDailyReportsDto } from './dtos/CreateDailyReportsDto';

async function createDailyReports(req: Request, res: Response) {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async (request: Request) => {
        const { UserUID: createdBy } = AccessRights.authorizationDecode(request);

        const data: CreateDailyReportsDto = plainToClass(CreateDailyReportsDto, request.body);
        data.CreatedBy = createdBy;

        const result = await new CreateDailyReportsController().createDailyReports(data);

        return result;
    });
}

exports.post = createDailyReports;

@Route('drydock/daily-reports/create-daily-reports')
export class CreateDailyReportsController extends Controller {
    @Post()
    public async createDailyReports(@Body() data: CreateDailyReportsDto): Promise<void> {
        const command = new CreateDailyReportsCommand();

        return command.ExecuteAsync(data);
    }
}
