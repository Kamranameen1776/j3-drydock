import { getManager } from 'typeorm';

import { J3PrcCompanyRegistryEntity } from '../../../entity/drydock';
import { IYardsResultDto } from './dtos/IYardsResultDto';

export class YardsRepository {
    public async getYards(): Promise<IYardsResultDto[]> {
        const yardsRepository = getManager().getRepository(J3PrcCompanyRegistryEntity);

        return yardsRepository
            .createQueryBuilder('yd')
            .select(
                `yd.uid as uid,
                yd.registeredName as yardName,
                yd.country + ', ' + yd.city as yardLocation
                `,
            )
            .where(`yd.active_status = 1 AND yd.type = 'Yard'`)
            .execute();
    }
}
