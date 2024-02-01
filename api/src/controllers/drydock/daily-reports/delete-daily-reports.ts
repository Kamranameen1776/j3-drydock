import { plainToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { AccessRights } from 'j2utils';
import { Body, Controller, Put, Route } from 'tsoa';

import { DeleteDailyReportsCommand } from '../../../application-layer/drydock/daily-reports/DeleteDailyReportsCommand';
import { MiddlewareHandler } from '../core/middleware/MiddlewareHandler';
import { DeleteDailyReportsDto } from './dtos/DeleteDailyReportsDto';

async function deleteDailyReports(req: Request, res: Response) {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async (request: Request) => {
        const { UserUID: deletedBy } = AccessRights.authorizationDecode(req);

        const deleteDailyReportsDto: DeleteDailyReportsDto = plainToClass(DeleteDailyReportsDto, request.body);
        deleteDailyReportsDto.UserUid = deletedBy;

        const result = await new DeleteDailyReportsController().deleteDailyReports(deleteDailyReportsDto);

        return result;
    });
}

exports.put = deleteDailyReports;

@Route('drydock/daily-reports/delete-daily-reports')
export class DeleteDailyReportsController extends Controller {
    @Put()
    public async deleteDailyReports(@Body() deleteDailyReportsDto: DeleteDailyReportsDto): Promise<void> {
        const command = new DeleteDailyReportsCommand();

        return command.ExecuteAsync(deleteDailyReportsDto);
    }
}
