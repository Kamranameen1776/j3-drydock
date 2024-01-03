import { ValidatePmsJobDeleteQuery } from '../../../../application-layer/drydock/specification-details/sub-items/ValidatePmsJobDeleteQuery';
import { Req, Res } from '../../../../common/drydock/ts-helpers/req-res';
import { ValidatePmsJobDeleteDto } from '../../../../dal/drydock/specification-details/sub-items/dto/ValidatePmsJobDeleteDto';
import { MiddlewareHandler } from '../../core/middleware/MiddlewareHandler';

async function validatePmsJobDeletion(req: Req<ValidatePmsJobDeleteDto>, res: Res): Promise<void> {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async () => {
        const command = new ValidatePmsJobDeleteQuery();

        return command.ExecuteAsync(req, ValidatePmsJobDeleteDto);
    });
}

exports.post = validatePmsJobDeletion;
