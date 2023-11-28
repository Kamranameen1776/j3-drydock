import { AccessRights } from 'j2utils';

import { CreateSubItemCommand } from '../../../../application-layer/drydock/specification-details/sub-items/CreateSubItemCommand';
import { type Req, type Res } from '../../../../common/drydock/ts-helpers/req-res';
import { type CreateOneParams } from '../../../../dal/drydock/specification-details/sub-items/dto/CreateOneParams';
import { type SpecificationDetailsSubItemEntity } from '../../../../entity/drydock/SpecificationDetailsSubItemEntity';
import { MiddlewareHandler } from '../../core/middleware/MiddlewareHandler';

/** @private */
type ReqBody = Omit<CreateOneParams, 'createdBy'>;

async function createSubItem(req: Req<ReqBody>, res: Res<SpecificationDetailsSubItemEntity>): Promise<void> {
    const { UserUID: createdBy }: { UserUID: string } = AccessRights.authorizationDecode(req);

    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async () => {
        const command = new CreateSubItemCommand();

        await command.ExecuteAsync({
            ...req.body,
            createdBy,
        });
    });
}

exports.post = createSubItem;
