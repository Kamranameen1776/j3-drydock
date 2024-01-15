import { AccessRights } from 'j2utils';

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
        const command = new CreateSubItemCommand();

        // FIXME: (create-sub-item) 1.1 convert request to response
        await command.ExecuteAsync({
            ...req.body,
            createdBy,
        });
    });
}

// FIXME: (create-sub-item) 1 map endpoint to handler
exports.post = createSubItem;
