import { AccessRights } from 'j2utils';
import { Body, Controller, Post, Route } from 'tsoa';

import { CreateSubItemsCommand } from '../../../../application-layer/drydock/specification-details/sub-items/CreateSubItemsCommand';
import { type Req, type Res } from '../../../../common/drydock/ts-helpers/req-res';
import { CreateManyParams } from '../../../../dal/drydock/specification-details/sub-items/dto/CreateManyParams';
import { SpecificationDetailsSubItemEntity } from '../../../../entity/drydock/SpecificationDetailsSubItemEntity';
import { MiddlewareHandler } from '../../core/middleware/MiddlewareHandler';

/** @private */
type ReqBody = Omit<CreateManyParams, 'createdBy'>;

async function createSubItems(req: Req<ReqBody>, res: Res<SpecificationDetailsSubItemEntity[]>) {
    const { UserUID: createdBy }: { UserUID: string } = AccessRights.authorizationDecode(req);

    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async () => {
        const result = await new CreateSubItemsController().createSubItems({
            ...req.body,
            createdBy,
        });

        return result;
    });
}

exports.post = createSubItems;

// @Route('drydock/specification-details/sub-items/create-sub-items')
export class CreateSubItemsController extends Controller {
    @Post()
    // TODO: check if newer version of tsoa supports async return types
    // public async createSubItems(@Body() request: CreateManyParams): Promise<SpecificationDetailsSubItemEntity[]> {
    public async createSubItems(@Body() request: CreateManyParams): Promise<unknown> {
        const query = new CreateSubItemsCommand();

        const result = await query.ExecuteAsync(request);

        return result;
    }
}
