import { Request, Response } from 'express';

import { AddSpecificationPmsCommand } from '../../../../application-layer/drydock/specification-details/AddSpecificationPMSCommand';
import {
    UpdateSpecificationPmsDto,
    UpdateSpecificationPmsRequestDto,
} from '../../../../application-layer/drydock/specification-details/dtos/UpdateSpecificationPMSRequestDto';
import { MiddlewareHandler } from '../../core/middleware/MiddlewareHandler';

async function AddPmsJob(req: Request, res: Response) {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async (request: Request) => {
        const command = new AddSpecificationPmsCommand();

        return command.ExecuteAsync(request as UpdateSpecificationPmsRequestDto, UpdateSpecificationPmsDto);
    });
}

exports.post = AddPmsJob;
