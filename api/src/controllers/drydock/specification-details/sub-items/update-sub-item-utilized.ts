import { Response } from 'express';

import { UpdateSubItemUtilizedCommand } from '../../../../application-layer/drydock/specification-details/sub-items/UpdateSubItemUtilizedCommand';
import { Req } from '../../../../common/drydock/ts-helpers/req-res';
import { UpdateSubItemUtilizedDto } from '../../../../dal/drydock/specification-details/sub-items/dto/UpdateSubItemUtilizedDto';
import { MiddlewareHandler } from '../../core/middleware/MiddlewareHandler';

async function updateSubItemUtilized(req: Req<UpdateSubItemUtilizedDto>, res: Response) {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async () => {
        const command = new UpdateSubItemUtilizedCommand();

        await command.ExecuteAsync(req, UpdateSubItemUtilizedDto);
    });
}

exports.put = updateSubItemUtilized;
