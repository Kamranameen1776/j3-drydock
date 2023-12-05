import { Request } from 'express';
import { ODataService } from 'j2utils';
import { ODataResult } from 'shared/interfaces';
import { getConnection, getManager } from 'typeorm';

import { JobOrderEntity } from '../../../../entity/drydock/JobOrderEntity';
import { IJobOrderDto } from './IJobOrderDto';

export class JobOrdersRepository {
    public async GetJobOrders(request: Request): Promise<ODataResult<IJobOrderDto>> {
        const JobOrdersRepository = getManager().getRepository(JobOrderEntity);

        const query: string = JobOrdersRepository.createQueryBuilder('jo')
            .select([
                'jo.uid AS JobOrderUid',
                'jo.SpecificationUid AS SpecificationUid',
                '123 AS Code',
                'jo.Subject AS Subject',
                '123 AS ItemSource',
                'jo.Status AS Status',
                'jo.Progress AS Progress',
                '123 AS Responsible',
                '123 AS Updates',
                'cast(getdate() as datetimeoffset) AS LastUpdated',
            ])
            .where('jo.ActiveStatus = 1')
            .getQuery();

        const oDataService = new ODataService(request, getConnection);

        return oDataService.getJoinResult(query);
    }
}
