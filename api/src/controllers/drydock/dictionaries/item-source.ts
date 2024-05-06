import { Controller, Get, Route } from 'tsoa';

import { GetItemSourcesQuery } from '../../../application-layer/drydock/dictionaries/get-item-sources/GetItemSourcesQuery';
import { LibItemSourceEntity } from '../../../entity/drydock';
import { MiddlewareHandler } from '../core/middleware/MiddlewareHandler';

@Route('drydock/dictionaries/item-source')
export class GetItemSourceController extends Controller {
    @Get()
    public async getItemSource(): Promise<LibItemSourceEntity[]> {
        const query = new GetItemSourcesQuery();

        const result = await query.ExecuteRequestAsync();

        return result;
    }
}

exports.get = new MiddlewareHandler().ExecuteHandlerAsync(new GetItemSourceController().getItemSource);
