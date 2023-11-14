import { getManager } from 'typeorm';

import { yards } from '../../../entity/yards';

export class YardsRepository {
    public async getYards(): Promise<yards> {
        const yardsRepository = getManager().getRepository(yards);

        return await yardsRepository
            .createQueryBuilder('yd')
            .select(
                `yd.Uid as uid,
                yd.YardName as yardName,
                yd.YardLocation as yardLocation,
                yd.ActiveStatus as activeStatus,
                yd.CreatedBy as createdBy,
                yd.CreatedAt as createdAt,
                yd.DeletedBy as deletedBy,
                yd.DeletedAt as deletedAt
                `,
            )
            .where(`yd.ActiveStatus = 1`)
            .execute();
    }
}
