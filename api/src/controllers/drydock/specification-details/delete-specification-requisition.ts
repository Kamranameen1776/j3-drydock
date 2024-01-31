import { Request, Response } from 'express';
import { Body, Controller, Post } from 'tsoa';

import { DeleteSpecificationRequisitionsRequestDto } from '../../../application-layer/drydock/specification-details/dtos/DeleteSpecificationRequisitionsRequestDto';
import { DeleteSpecificationRequisitionCommand } from '../../../application-layer/drydock/specification-details/requisitions/DeleteSpecificationRequisitionCommand';
import { MiddlewareHandler } from '../core/middleware/MiddlewareHandler';

async function deleteSpecificationRequisitions(req: Request, res: Response) {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async (request: Request) => {
        const result = await new DeleteSpecificationRequisitionsController().deleteSpecificationRequisitions(request);

        return result;
    });
}

exports.post = deleteSpecificationRequisitions;

// @Route('drydock/specification-details/delete-specification-requisition')
export class DeleteSpecificationRequisitionsController extends Controller {
    @Post()
    public async deleteSpecificationRequisitions(@Body() request: Request): Promise<void> {
        const query = new DeleteSpecificationRequisitionCommand();

        const result = await query.ExecuteAsync(request, DeleteSpecificationRequisitionsRequestDto);

        return result;
    }
}
