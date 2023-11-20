import { getManager } from 'typeorm';

import { YardsEntity } from '../../../entity/drydock/YardsEntity';
import { IYardsResultDto } from './dtos/IYardsResultDto';

export class YardsRepository {
    public async getYards(): Promise<IYardsResultDto> {
        const yardsRepository = getManager().getRepository(YardsEntity);

        return yardsRepository
            .createQueryBuilder('yd')
            .select(
                `yd.Uid as uid,
                yd.yard_name as yardName,
                yd.yard_location as yardLocation
                `,
            )
            .where(`yd.active_status = 1`)
            .execute();
    }
}
