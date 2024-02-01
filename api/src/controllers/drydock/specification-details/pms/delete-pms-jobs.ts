import { Request, Response } from 'express';
import { Body, Controller, Delete } from 'tsoa';

import {
    UpdateSpecificationPmsDto,
    UpdateSpecificationPmsRequestDto,
} from '../../../../application-layer/drydock/specification-details/dtos/UpdateSpecificationPMSRequestDto';
import { DeleteSpecificationPmsCommand } from '../../../../application-layer/drydock/specification-details/PMS/DeleteSpecificationPMSCommand';
import { MiddlewareHandler } from '../../core/middleware/MiddlewareHandler';

async function DeletePmsJob(req: Request, res: Response) {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async (request: Request) => {
        const result = await new DeletePmsJobController().updateJobOrderDuration(request);

        return result;
    });
}

exports.delete = DeletePmsJob;

// @Route('drydock/specification-details/pms/delete-pms-jobs')
export class DeletePmsJobController extends Controller {
    @Delete()
    public async updateJobOrderDuration(@Body() request: Request): Promise<void> {
        const query = new DeleteSpecificationPmsCommand();

        const result = await query.ExecuteAsync(request as UpdateSpecificationPmsRequestDto, UpdateSpecificationPmsDto);

        return result;
    }
}
