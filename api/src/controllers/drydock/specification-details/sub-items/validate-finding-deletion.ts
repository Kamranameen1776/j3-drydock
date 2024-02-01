import { Request } from 'express';
import { Body, Controller, Post } from 'tsoa';

import { ValidateFindingDeleteQuery } from '../../../../application-layer/drydock/specification-details/sub-items/ValidateFindingDeleteQuery';
import { Req, Res } from '../../../../common/drydock/ts-helpers/req-res';
import { ValidateFindingDeleteDto } from '../../../../dal/drydock/specification-details/sub-items/dto/ValidateFindingDeleteDto';
import { MiddlewareHandler } from '../../core/middleware/MiddlewareHandler';

async function validateFindingDeletion(req: Req<ValidateFindingDeleteDto>, res: Res): Promise<void> {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async () => {
        const result = await new ValidateFindingDeletionController().validateFindingDeletion(req);

        return result;
    });
}

exports.post = validateFindingDeletion;

// @Route('drydock/specification-details/sub-items/validate-finding-deletion')
export class ValidateFindingDeletionController extends Controller {
    @Post()
    public async validateFindingDeletion(@Body() request: Request): Promise<boolean> {
        const query = new ValidateFindingDeleteQuery();

        const result = await query.ExecuteAsync(request, ValidateFindingDeleteDto);

        return result;
    }
}
