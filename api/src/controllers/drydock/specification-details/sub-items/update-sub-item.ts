import { AccessRights } from 'j2utils';

import { UpdateSubItemCommand } from '../../../../application-layer/drydock/specification-details/sub-items/UpdateSubItemCommand';
import { type Req, type Res } from '../../../../common/drydock/ts-helpers/req-res';
import { type UpdateOneParams } from '../../../../dal/drydock/specification-details/sub-items/dto/UpdateOneParams';
import { type SpecificationDetailsSubItemEntity } from '../../../../entity/drydock/SpecificationDetailsSubItemEntity';
import { MiddlewareHandler } from '../../core/middleware/MiddlewareHandler';

/** @private */
type ReqBody = Omit<UpdateOneParams, 'updatedBy'>;

async function updateSubItem(req: Req<ReqBody>, res: Res<SpecificationDetailsSubItemEntity>) {
    const { UserUID: updatedBy }: { UserUID: string } = AccessRights.authorizationDecode(req);

    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async () => {
        const command = new UpdateSubItemCommand();

        await command.ExecuteAsync({
            ...req.body,
            updatedBy,
        });
    });
}

exports.put = updateSubItem;
