import { Request, Response } from 'express';
import { Body, Controller, Post, Route } from 'tsoa';

import { UpdateSpecificationPmsDto } from '../../../../application-layer/drydock/specification-details/dtos/UpdateSpecificationPMSRequestDto';
import { AddSpecificationPmsCommand } from '../../../../application-layer/drydock/specification-details/PMS/AddSpecificationPMSCommand';
import { MiddlewareHandler } from '../../core/middleware/MiddlewareHandler';

async function AddPmsJob(req: Request, res: Response) {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async (request: Request) => {
        const result = await new AddPmsJobController().AddPmsJob(request.body);

        return result;
    });
}

exports.post = AddPmsJob;

@Route('drydock/specification-details/pms/add-pms-jobs')
export class AddPmsJobController extends Controller {
    @Post()
    public async AddPmsJob(@Body() dto: UpdateSpecificationPmsDto): Promise<void> {
        const query = new AddSpecificationPmsCommand();

        const result = await query.ExecuteAsync(dto);

        return result;
    }
}
