import { AccessRights } from 'j2utils';
import { Body, Controller, Post, Route } from 'tsoa';

import { CreateSubItemCommand } from '../../../../application-layer/drydock/specification-details/sub-items/CreateSubItemCommand';
import { type Req, type Res } from '../../../../common/drydock/ts-helpers/req-res';
import { type CreateSubItemParams } from '../../../../dal/drydock/specification-details/sub-items/dto/CreateSubItemParams';
import { type SpecificationDetailsSubItemEntity } from '../../../../entity/drydock/SpecificationDetailsSubItemEntity';
import { MiddlewareHandler } from '../../core/middleware/MiddlewareHandler';

/** @private */
type ReqBody = Omit<CreateSubItemParams, 'createdBy'>;

async function createSubItem(req: Req<ReqBody>, res: Res<SpecificationDetailsSubItemEntity>): Promise<void> {
    const { UserUID: createdBy }: { UserUID: string } = AccessRights.authorizationDecode(req);

    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async () => {
        const result = await new CreateSubItemController().createSubItem({
            ...req.body,
            createdBy,
        });

        return result;
    });
}

exports.post = createSubItem;

@Route('drydock/specification-details/sub-items/create-sub-item')
export class CreateSubItemController extends Controller {
    @Post()

    // TODO: check if newer version of tsoa supports async return types
    // public async createSubItem(@Body() request: CreateSubItemParams): Promise<SpecificationDetailsSubItemEntity> {
    public async createSubItem(@Body() request: CreateSubItemParams): Promise<unknown> {
        const query = new CreateSubItemCommand();

        const result = await query.ExecuteAsync(request);

        return result;
    }
}
