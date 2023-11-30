import { Request, Response } from 'express';

import { GetStandardJobPopupQuery } from '../../../application-layer/drydock/standard-jobs';
import {
    GetStandardJobPopupRequestBodyDto,
    GetStandardJobPopupRequestDto,
} from '../../../application-layer/drydock/standard-jobs/dto';
import { MiddlewareHandler } from '../core/middleware/MiddlewareHandler';

/**
 * This handler returns all available shipments
 * GET /drydock/standard-jobs/get-standard-jobs-popup
 * @exports
 * @param {Request} req Express request
 * @param {Response} res Express response
 */
export async function getStandardJobsPopup(req: Request, res: Response) {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async (request: Request) => {
        // Prepare query payload
        const query = new GetStandardJobPopupQuery();

        // Execute query
        return query.ExecuteAsync(request as GetStandardJobPopupRequestDto, GetStandardJobPopupRequestBodyDto);
    });
}

exports.post = getStandardJobsPopup;
