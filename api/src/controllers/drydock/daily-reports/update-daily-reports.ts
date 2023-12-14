import { plainToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { AccessRights } from 'j2utils';

import { UpdateDailyReportsCommand } from '../../../application-layer/drydock/daily-reports/UpdateDailyReportsCommand';
import { MiddlewareHandler } from '../core/middleware/MiddlewareHandler';
import { UpdateDailyReportsDto } from './dtos/UpdateDailyReportsDto';

async function updateDailyReports(req: Request, res: Response) {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async (request: Request) => {
        const { UserUID: updatedBy } = AccessRights.authorizationDecode(request);

        const command = new UpdateDailyReportsCommand();

        const updateDailyReportsDto: UpdateDailyReportsDto = plainToClass(UpdateDailyReportsDto, request.body);
        updateDailyReportsDto.UserUid = updatedBy;

        return command.ExecuteAsync(updateDailyReportsDto);
    });
}

exports.put = updateDailyReports;
