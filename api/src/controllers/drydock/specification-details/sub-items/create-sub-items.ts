import { AccessRights } from 'j2utils';

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
        const command = new CreateSubItemsCommand();

        await command.ExecuteAsync({
            ...req.body,
            createdBy,
        });
    });
}

exports.post = createSubItems;
