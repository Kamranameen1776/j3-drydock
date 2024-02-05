import { Request, Response } from 'express';
import { Body, Controller, Post, Route } from 'tsoa';

import { DeleteSpecificationRequisitionsRequestDto } from '../../../application-layer/drydock/specification-details/dtos/DeleteSpecificationRequisitionsRequestDto';
import { DeleteSpecificationRequisitionCommand } from '../../../application-layer/drydock/specification-details/requisitions/DeleteSpecificationRequisitionCommand';
import { MiddlewareHandler } from '../core/middleware/MiddlewareHandler';

async function deleteSpecificationRequisitions(req: Request, res: Response) {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async (request: Request) => {
        const result = await new DeleteSpecificationRequisitionsController().deleteSpecificationRequisitions(
            request.body,
        );

        return result;
    });
}

exports.post = deleteSpecificationRequisitions;

// @Route('drydock/specification-details/delete-specification-requisition')
export class DeleteSpecificationRequisitionsController extends Controller {
    @Post()
    public async deleteSpecificationRequisitions(
        @Body() dto: DeleteSpecificationRequisitionsRequestDto,
    ): Promise<void> {
        const query = new DeleteSpecificationRequisitionCommand();

        const result = await query.ExecuteAsync(dto);

        return result;
    }
}
