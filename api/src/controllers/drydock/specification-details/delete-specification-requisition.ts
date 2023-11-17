import { Request, Response } from 'express';

import { DeleteSpecificationRequisitionCommand } from '../../../application-layer/drydock/specification-details/DeleteSpecificationRequisitionCommand';
import { DeleteSpecificationRequisitionsRequestDto } from '../../../application-layer/drydock/specification-details/dtos/DeleteSpecificationRequisitionsRequestDto';
import { MiddlewareHandler } from '../core/middleware/MiddlewareHandler';

async function deleteSpecificationRequisitions(req: Request, res: Response) {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async (request: Request) => {
        const command = new DeleteSpecificationRequisitionCommand();

        return command.ExecuteAsync(request, DeleteSpecificationRequisitionsRequestDto);
    });
}

exports.post = deleteSpecificationRequisitions;
