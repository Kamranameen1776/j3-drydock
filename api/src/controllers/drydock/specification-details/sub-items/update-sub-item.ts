import { AccessRights } from 'j2utils';
import { Body, Controller, Put, Route } from 'tsoa';

import { UpdateSubItemCommand } from '../../../../application-layer/drydock/specification-details/sub-items/UpdateSubItemCommand';
import { type Req, type Res } from '../../../../common/drydock/ts-helpers/req-res';
import { type UpdateSubItemParams } from '../../../../dal/drydock/specification-details/sub-items/dto/UpdateSubItemParams';
import { type SpecificationDetailsSubItemEntity } from '../../../../entity/drydock/SpecificationDetailsSubItemEntity';
import { MiddlewareHandler } from '../../core/middleware/MiddlewareHandler';

/** @private */
type ReqBody = Omit<UpdateSubItemParams, 'updatedBy'>;

async function updateSubItem(req: Req<ReqBody>, res: Res<SpecificationDetailsSubItemEntity>) {
    const { UserUID: updatedBy }: { UserUID: string } = AccessRights.authorizationDecode(req);

    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async () => {
        const result = await new UpdateSubItemController().updateSubItem({
            ...req.body,
            updatedBy,
        });

        return result;
    });
}

exports.put = updateSubItem;

// @Route('drydock/specification-details/sub-items/update-sub-item')
export class UpdateSubItemController extends Controller {
    @Put()

    // TODO: check if newer version of tsoa supports returning a specific type
    // public async updateSubItem(@Body() request: UpdateSubItemParams): Promise<SpecificationDetailsSubItemEntity> {
    public async updateSubItem(@Body() request: UpdateSubItemParams): Promise<unknown> {
        const query = new UpdateSubItemCommand();

        const result = await query.ExecuteAsync(request);

        return result;
    }
}
