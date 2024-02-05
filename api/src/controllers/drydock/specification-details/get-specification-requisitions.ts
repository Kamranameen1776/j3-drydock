import { Request, Response } from 'express';
import { Body, Controller, Post, Route } from 'tsoa';

import { GetRequisitionsResponseDto } from '../../../application-layer/drydock/specification-details/dtos/GetRequisitionsResponseDto';
import {
    GetSpecificationBodyDto,
    GetSpecificationRequisitionsRequestDto,
} from '../../../application-layer/drydock/specification-details/dtos/GetSpecificationRequisitionsRequestDto';
import { GetSpecificationRequisitionsQuery } from '../../../application-layer/drydock/specification-details/requisitions/GetSpecificationRequisitionsQuery';
import { ODataResult } from '../../../shared/interfaces';
import { MiddlewareHandler } from '../core/middleware/MiddlewareHandler';

async function getSpecificationRequisitions(req: Request, res: Response) {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async (request: Request) => {
        const result = await new GetSpecificationRequisitionsController().getSpecificationRequisitions(
            request as GetSpecificationRequisitionsRequestDto,
        );

        return result;
    });
}

exports.post = getSpecificationRequisitions;

// @Route('drydock/specification-details/get-specification-requisitions')
export class GetSpecificationRequisitionsController extends Controller {
    @Post()
    public async getSpecificationRequisitions(
        @Body() dto: GetSpecificationRequisitionsRequestDto,
    ): Promise<ODataResult<GetRequisitionsResponseDto>> {
        const query = new GetSpecificationRequisitionsQuery();

        const result = await query.ExecuteAsync(dto, GetSpecificationBodyDto);

        return result;
    }
}
