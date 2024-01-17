import { ValidateFindingDeleteQuery } from '../../../../application-layer/drydock/specification-details/sub-items/ValidateFindingDeleteQuery';
import { Req, Res } from '../../../../common/drydock/ts-helpers/req-res';
import { ValidateFindingDeleteDto } from '../../../../dal/drydock/specification-details/sub-items/dto/ValidateFindingDeleteDto';
import { MiddlewareHandler } from '../../core/middleware/MiddlewareHandler';

async function validateFindingDeletion(req: Req<ValidateFindingDeleteDto>, res: Res): Promise<void> {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async () => {
        const command = new ValidateFindingDeleteQuery();

        return command.ExecuteAsync(req, ValidateFindingDeleteDto);
    });
}

exports.post = validateFindingDeletion;
