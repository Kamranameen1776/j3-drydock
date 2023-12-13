import { plainToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { AccessRights } from 'j2utils';

import { DeleteDailyReportsCommand } from '../../../application-layer/drydock/daily-reports/DeleteDailyReportsCommand';
import { MiddlewareHandler } from '../core/middleware/MiddlewareHandler';
import { DeleteDailyReportsDto } from './dtos/DeleteDailyReportsDto';

async function deleteDailyReports(req: Request, res: Response) {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async (request: Request) => {
        const { UserUID: deletedBy } = AccessRights.authorizationDecode(req);

        const command = new DeleteDailyReportsCommand();

        const deleteDailyReportsDto: DeleteDailyReportsDto = plainToClass(DeleteDailyReportsDto, request.body);
        deleteDailyReportsDto.deletedBy = deletedBy;

        return command.ExecuteAsync(deleteDailyReportsDto);
    });
}

exports.put = deleteDailyReports;
