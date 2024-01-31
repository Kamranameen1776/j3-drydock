import { plainToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { AccessRights } from 'j2utils';
import { Body, Controller, Put, Route } from 'tsoa';

import { UpdateDailyReportsCommand } from '../../../application-layer/drydock/daily-reports/UpdateDailyReportsCommand';
import { MiddlewareHandler } from '../core/middleware/MiddlewareHandler';
import { UpdateDailyReportsDto } from './dtos/UpdateDailyReportsDto';

async function updateDailyReports(req: Request, res: Response) {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async (request: Request) => {
        const { UserUID: updatedBy } = AccessRights.authorizationDecode(request);

        const updateDailyReportsDto: UpdateDailyReportsDto = plainToClass(UpdateDailyReportsDto, request.body);
        updateDailyReportsDto.UserUid = updatedBy;

        const result = await new UpdateDailyReportsController().updateDailyReports(updateDailyReportsDto);

        return result;
    });
}

exports.put = updateDailyReports;

@Route('drydock/daily-reports/update-daily-reports')
export class UpdateDailyReportsController extends Controller {
    @Put()
    public async updateDailyReports(@Body() dto: UpdateDailyReportsDto): Promise<void> {
        const query = new UpdateDailyReportsCommand();

        const result = await query.ExecuteAsync(dto);

        return result;
    }
}
