import { Request, Response } from 'express';
import { Body, Controller, Delete, Route } from 'tsoa';

import { UpdateSpecificationPmsDto } from '../../../../application-layer/drydock/specification-details/dtos/UpdateSpecificationPMSRequestDto';
import { DeleteSpecificationPmsCommand } from '../../../../application-layer/drydock/specification-details/PMS/DeleteSpecificationPMSCommand';
import { MiddlewareHandler } from '../../core/middleware/MiddlewareHandler';

async function DeletePmsJob(req: Request, res: Response) {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async (request: Request) => {
        const result = await new DeletePmsJobController().updateJobOrderDuration(request.body);

        return result;
    });
}

exports.delete = DeletePmsJob;

// @Route('drydock/specification-details/pms/delete-pms-jobs')
export class DeletePmsJobController extends Controller {
    @Delete()
    public async updateJobOrderDuration(@Body() dto: UpdateSpecificationPmsDto): Promise<void> {
        const query = new DeleteSpecificationPmsCommand();

        const result = await query.ExecuteAsync(dto);

        return result;
    }
}
