import { AccessRights } from 'j2utils';
import { Body, Controller, Put, Route } from 'tsoa';

import { DeleteSubItemCommand } from '../../../../application-layer/drydock/specification-details/sub-items/DeleteSubItemCommand';
import { Req, Res } from '../../../../common/drydock/ts-helpers/req-res';
import { DeleteSubItemParams } from '../../../../dal/drydock/specification-details/sub-items/dto/DeleteSubItemParams';
import { MiddlewareHandler } from '../../core/middleware/MiddlewareHandler';

/** @private */
type ReqBody = Omit<DeleteSubItemParams, 'deletedBy'>;

async function deleteSubItem(req: Req<ReqBody>, res: Res): Promise<void> {
    const { UserUID: deletedBy }: { UserUID: string } = AccessRights.authorizationDecode(req);

    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async () => {
        const result = await new DeleteSubItemController().deleteSubItem({
            ...req.body,
            deletedBy,
        });

        return result;
    });
}

exports.put = deleteSubItem;

@Route('drydock/specification-details/sub-items/delete-sub-item')
export class DeleteSubItemController extends Controller {
    @Put()
    public async deleteSubItem(@Body() request: DeleteSubItemParams): Promise<void> {
        const query = new DeleteSubItemCommand();

        const result = await query.ExecuteAsync(request);

        return result;
    }
}
