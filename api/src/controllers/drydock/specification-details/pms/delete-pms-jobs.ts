import { Request, Response } from 'express';

import { DeleteSpecificationPmsCommand } from '../../../../application-layer/drydock/specification-details/DeleteSpecificationPMSCommand';
import {
    UpdateSpecificationPmsDto,
    UpdateSpecificationPmsRequestDto,
} from '../../../../application-layer/drydock/specification-details/dtos/UpdateSpecificationPMSRequestDto';
import { MiddlewareHandler } from '../../core/middleware/MiddlewareHandler';

async function DeletePmsJob(req: Request, res: Response) {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async (request: Request) => {
        const command = new DeleteSpecificationPmsCommand();

        return command.ExecuteAsync(request as UpdateSpecificationPmsRequestDto, UpdateSpecificationPmsDto);
    });
}

exports.delete = DeletePmsJob;
