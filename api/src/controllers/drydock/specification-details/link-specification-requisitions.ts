import { Request, Response } from 'express';
import { Body, Controller, Post, Route } from 'tsoa';

import { LinkSpecificationRequisitionsRequestDto } from '../../../application-layer/drydock/specification-details/dtos/LinkSpecificationRequisitionsRequestDto';
import { LinkSpecificationRequisitionCommand } from '../../../application-layer/drydock/specification-details/requisitions/LinkSpecificationRequisitionCommand';
import { SpecificationRequisitionsEntity } from '../../../entity/drydock';
import { MiddlewareHandler } from '../core/middleware/MiddlewareHandler';

async function linkSpecificationRequisitions(req: Request, res: Response) {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async (request: Request) => {
        const result = await new LinkSpecificationRequisitionsController().linkSpecificationRequisitions(request.body);

        return result;
    });
}

exports.post = linkSpecificationRequisitions;

@Route('drydock/specification-details/link-specification-requisitions')
export class LinkSpecificationRequisitionsController extends Controller {
    @Post()
    public async linkSpecificationRequisitions(
        @Body() dto: LinkSpecificationRequisitionsRequestDto,
    ): Promise<SpecificationRequisitionsEntity[]> {
        const query = new LinkSpecificationRequisitionCommand();

        const result = await query.ExecuteAsync(dto);

        return result;
    }
}
