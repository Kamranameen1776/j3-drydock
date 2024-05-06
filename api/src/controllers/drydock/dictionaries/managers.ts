import { Controller, Get, Route } from 'tsoa';

import { GetManagersQuery } from '../../../application-layer/drydock/dictionaries';
import { LibUserEntity } from '../../../entity/drydock';
import { MiddlewareHandler } from '../core/middleware/MiddlewareHandler';

@Route('drydock/dictionaries/managers')
export class GetManagersController extends Controller {
    @Get()
    public async getManagers(): Promise<LibUserEntity[]> {
        const query = new GetManagersQuery();

        const result = await query.ExecuteAsync();

        return result;
    }
}

exports.get = new MiddlewareHandler().ExecuteHandlerAsync(new GetManagersController().getManagers);
