import { AccessRights } from 'j2utils';

import { DeleteSubItemsCommand } from '../../../../application-layer/drydock/specification-details/sub-items/DeleteSubItemsCommand';
import { type EntityExistenceMap } from '../../../../common/drydock/ts-helpers/calculate-entity-existence-map';
import { type Req, type Res } from '../../../../common/drydock/ts-helpers/req-res';
import { type DeleteManyParams } from '../../../../dal/drydock/specification-details/sub-items/dto/DeleteManyParams';
import { MiddlewareHandler } from '../../core/middleware/MiddlewareHandler';

/** @private */
type ReqBody = Omit<DeleteManyParams, 'deletedBy'>;

async function deleteSubItems(req: Req<ReqBody>, res: Res<EntityExistenceMap>): Promise<void> {
    const { UserUID: deletedBy }: { UserUID: string } = AccessRights.authorizationDecode(req);

    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async () => {
        const command = new DeleteSubItemsCommand();

        await command.ExecuteAsync({
            ...req.body,
            deletedBy,
        });
    });
}

exports.delete = deleteSubItems;
