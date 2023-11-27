import { Request, Response } from 'express';

import { CreateSubItemFromProcurementJobCommand } from '../../../../application-layer/drydock/specification-details/CreateSubItemFromProcurementJobCommand';
import { UpdateSpecificationSubItemRequestDto } from '../../../../application-layer/drydock/specification-details/dtos/UpdateSpecificationSubItemRequestDto';
import { MiddlewareHandler } from '../../core/middleware/MiddlewareHandler';

async function CreateFromProcurementJob(req: Request, res: Response) {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async (request: Request) => {
        const command = new CreateSubItemFromProcurementJobCommand();
        return command.ExecuteAsync(
            request as UpdateSpecificationSubItemRequestDto,
            UpdateSpecificationSubItemRequestDto,
        );
    });
}

exports.post = CreateFromProcurementJob;
