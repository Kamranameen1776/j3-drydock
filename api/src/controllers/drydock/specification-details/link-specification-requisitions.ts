import { Request, Response } from 'express';

import { MiddlewareHandler } from '../core/middleware/MiddlewareHandler';
import { LinkSpecificationRequisitionCommand } from '../../../application-layer/drydock/specification-details/LinkSpecificationRequisitionCommand';
import { LinkSpecificationRequisitionsRequestDto } from '../../../application-layer/drydock/specification-details/dtos/LinkSpecificationRequisitionsRequestDto';

async function linkSpecificationRequisitions(req: Request, res: Response) {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async (request: Request) => {
        const command = new LinkSpecificationRequisitionCommand();

        return await command.ExecuteAsync(request, LinkSpecificationRequisitionsRequestDto);
    });
}

exports.post = linkSpecificationRequisitions;
