import { Request, Response } from 'express';

import { LinkSpecificationRequisitionsRequestDto } from '../../../application-layer/drydock/specification-details/dtos/LinkSpecificationRequisitionsRequestDto';
import { LinkSpecificationRequisitionCommand } from '../../../application-layer/drydock/specification-details/requisitions/LinkSpecificationRequisitionCommand';
import { MiddlewareHandler } from '../core/middleware/MiddlewareHandler';

async function linkSpecificationRequisitions(req: Request, res: Response) {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async (request: Request) => {
        const command = new LinkSpecificationRequisitionCommand();

        return command.ExecuteAsync(request, LinkSpecificationRequisitionsRequestDto);
    });
}

exports.post = linkSpecificationRequisitions;
