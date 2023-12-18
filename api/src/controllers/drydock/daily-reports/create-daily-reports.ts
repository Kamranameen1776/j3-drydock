import { plainToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { AccessRights } from 'j2utils';

import { CreateDailyReportsCommand } from '../../../application-layer/drydock/daily-reports/CreateDailyReportsCommand';
import { MiddlewareHandler } from '../core/middleware/MiddlewareHandler';
import { CreateDailyReportsDto } from './dtos/CreateDailyReportsDto';

async function createDailyReports(req: Request, res: Response) {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async (request: Request) => {
        const { UserUID: createdBy } = AccessRights.authorizationDecode(request);

        const command = new CreateDailyReportsCommand();

        const createDailyReportsDto: CreateDailyReportsDto = plainToClass(CreateDailyReportsDto, request.body);
        createDailyReportsDto.UserUid = createdBy;

        return command.ExecuteAsync(createDailyReportsDto);
    });
}

exports.post = createDailyReports;
