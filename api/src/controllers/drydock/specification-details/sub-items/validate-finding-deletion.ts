import { Request, Response } from 'express';
import { Body, Controller, Post, Route } from 'tsoa';

import { ValidateFindingDeleteQuery } from '../../../../application-layer/drydock/specification-details/sub-items/ValidateFindingDeleteQuery';
import { ValidateFindingDeleteDto } from '../../../../dal/drydock/specification-details/sub-items/dto/ValidateFindingDeleteDto';
import { MiddlewareHandler } from '../../core/middleware/MiddlewareHandler';

async function validateFindingDeletion(req: Request, res: Response): Promise<void> {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async () => {
        const result = await new ValidateFindingDeletionController().validateFindingDeletion(req.body);

        return result;
    });
}

exports.post = validateFindingDeletion;

@Route('drydock/specification-details/sub-items/validate-finding-deletion')
export class ValidateFindingDeletionController extends Controller {
    @Post()
    public async validateFindingDeletion(@Body() dto: ValidateFindingDeleteDto): Promise<boolean> {
        const query = new ValidateFindingDeleteQuery();

        const result = await query.ExecuteAsync(dto);

        return result;
    }
}
