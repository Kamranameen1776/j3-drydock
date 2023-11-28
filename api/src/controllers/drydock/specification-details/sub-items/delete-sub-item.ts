import { AccessRights } from 'j2utils';

import { DeleteSubItemCommand } from '../../../../application-layer/drydock/specification-details/sub-items/DeleteSubItemCommand';
import { type Req, type Res } from '../../../../common/drydock/ts-helpers/req-res';
import { type DeleteOneParams } from '../../../../dal/drydock/specification-details/sub-items/dto/DeleteOneParams';
import { MiddlewareHandler } from '../../core/middleware/MiddlewareHandler';

/** @private */
type ReqBody = Omit<DeleteOneParams, 'deletedBy'>;

async function deleteSubItem(req: Req<ReqBody>, res: Res): Promise<void> {
    const { UserUID: deletedBy }: { UserUID: string } = AccessRights.authorizationDecode(req);

    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async () => {
        const command = new DeleteSubItemCommand();

        await command.ExecuteAsync({
            ...req.body,
            deletedBy,
        });
    });
}

exports.delete = deleteSubItem;
