import { Request, Response } from 'express';

import { CreateSubItemFromProcurementItemCommand } from '../../../../application-layer/drydock/specification-details/CreateSubItemFromProcurementItemCommand';
import { UpdateSpecificationSubItemRequestDto } from '../../../../application-layer/drydock/specification-details/dtos/UpdateSpecificationSubItemRequestDto';
import { MiddlewareHandler } from '../../core/middleware/MiddlewareHandler';

async function CreateFromProcurementItem(req: Request, res: Response) {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async (request: Request) => {
        const command = new CreateSubItemFromProcurementItemCommand();
        return command.ExecuteAsync(
            request as UpdateSpecificationSubItemRequestDto,
            UpdateSpecificationSubItemRequestDto,
        );
    });
}

exports.post = CreateFromProcurementItem;
