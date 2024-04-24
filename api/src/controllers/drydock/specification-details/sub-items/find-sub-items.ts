import { Body, Controller, Post, Route } from 'tsoa';

import { FindSubItemsQuery } from '../../../../application-layer/drydock/specification-details/sub-items/FindSubItemsQuery';
import { type Record } from '../../../../bll/drydock/specification-details/specification-sub-item.service';
import { type Req, type Res } from '../../../../common/drydock/ts-helpers/req-res';
import { type FindSpecificationSubItemsDto } from '../../../../dal/drydock/specification-details/sub-items/dto/FindSpecificationSubItemsDto';
import { type SpecificationDetailsSubItemEntity } from '../../../../entity/drydock/SpecificationDetailsSubItemEntity';
import { type ODataResult } from '../../../../shared/interfaces';
import { MiddlewareHandler } from '../../core/middleware/MiddlewareHandler';

async function findSubItems(
    req: Req<FindSpecificationSubItemsDto>,
    res: Res<ODataResult<SpecificationDetailsSubItemEntity>>,
): Promise<void> {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async () => {
        const result = await new FindSubItemsController().findSubItems(req.body as FindSpecificationSubItemsDto);

        return result;
    });
}

exports.post = findSubItems;

@Route('drydock/specification-details/sub-items/find-sub-items')
export class FindSubItemsController extends Controller {
    @Post()
    public async findSubItems(@Body() request: FindSpecificationSubItemsDto): Promise<ODataResult<Record>> {
        const query = new FindSubItemsQuery();

        const result = await query.ExecuteAsync(request);

        return result;
    }
}
