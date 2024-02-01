import { Request } from 'express';
import { Body, Controller, Post } from 'tsoa';

import { ValidatePmsJobDeleteQuery } from '../../../../application-layer/drydock/specification-details/sub-items/ValidatePmsJobDeleteQuery';
import { Req, Res } from '../../../../common/drydock/ts-helpers/req-res';
import { ValidatePmsJobDeleteDto } from '../../../../dal/drydock/specification-details/sub-items/dto/ValidatePmsJobDeleteDto';
import { MiddlewareHandler } from '../../core/middleware/MiddlewareHandler';

async function validatePmsJobDeletion(req: Req<ValidatePmsJobDeleteDto>, res: Res): Promise<void> {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async () => {
        const result = await new ValidatePmsJobDeletionController().validatePmsJobDeletion(req);

        return result;
    });
}

exports.post = validatePmsJobDeletion;

// @Route('drydock/specification-details/sub-items/validate-pms-job-deletion')
export class ValidatePmsJobDeletionController extends Controller {
    @Post()
    public async validatePmsJobDeletion(@Body() request: Request): Promise<boolean> {
        const query = new ValidatePmsJobDeleteQuery();

        const result = await query.ExecuteAsync(request, ValidatePmsJobDeleteDto);

        return result;
    }
}
