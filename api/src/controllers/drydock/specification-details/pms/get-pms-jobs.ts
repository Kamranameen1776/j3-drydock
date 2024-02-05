import { Request, Response } from 'express';
import { Controller, Get, Query, Route } from 'tsoa';

import { GetSpecificationQueryDto } from '../../../../application-layer/drydock/specification-details/dtos/GetSpecificationPMSRequestDto';
import { GetSpecificationPmsQuery } from '../../../../application-layer/drydock/specification-details/PMS/GetSpecificationPMSQuery';
import { MiddlewareHandler } from '../../core/middleware/MiddlewareHandler';

export async function getPmsJobs(req: Request, res: Response) {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async (request: Request) => {
        const result = await new GetPmsJobsController().getPmsJobs(request.query.uid as string);

        return result;
    });
}

exports.get = getPmsJobs;

// @Route('drydock/specification-details/pms/get-pms-jobs')
export class GetPmsJobsController extends Controller {
    @Get()
    public async getPmsJobs(@Query() uid: string): Promise<Array<string>> {
        const query = new GetSpecificationPmsQuery();

        const dto = new GetSpecificationQueryDto();
        dto.uid = uid;

        const result = await query.ExecuteAsync(dto);

        return result;
    }
}
