import { FindSubItemsQuery } from '../../../../application-layer/drydock/specification-details/sub-items/FindSubItemsQuery';
import { type Req, type Res } from '../../../../common/drydock/ts-helpers/req-res';
import { type FindManyParams } from '../../../../dal/drydock/specification-details/sub-items/dto/FindManyParams';
import { type SpecificationDetailsSubItemEntity } from '../../../../entity/drydock/SpecificationDetailsSubItemEntity';
import { type ODataResult } from '../../../../shared/interfaces/odata-result.interface';
import { MiddlewareHandler } from '../../core/middleware/MiddlewareHandler';

async function findSubItems(
    req: Req<FindManyParams>,
    res: Res<ODataResult<SpecificationDetailsSubItemEntity>>,
): Promise<void> {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async () => {
        const query = new FindSubItemsQuery();

        return query.ExecuteAsync(req.body);
    });
}

exports.post = findSubItems;
