import { FindSubItemsQuery } from '../../../../application-layer/drydock/specification-details/sub-items/FindSubItemsQuery';
import { type Req, type Res } from '../../../../common/drydock/ts-helpers/req-res';
import { type FindManyParams } from '../../../../dal/drydock/specification-details/sub-items/dto/FindManyParams';
import { type SpecificationDetailsSubItemEntity } from '../../../../entity/drydock/SpecificationDetailsSubItemEntity';
import { type ODataResult } from '../../../../shared/interfaces';
import { MiddlewareHandler } from '../../core/middleware/MiddlewareHandler';

async function findSubItems(
    req: Req<FindManyParams>,
    res: Res<ODataResult<SpecificationDetailsSubItemEntity>>,
): Promise<void> {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async () => {
        const query = new FindSubItemsQuery();

        // FIXME: (find-sub-items) 1.1 convert request to response
        return query.ExecuteAsync(req.body);
    });
}

// FIXME: (find-sub-items) 1 handle endpoint
exports.post = findSubItems;
