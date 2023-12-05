import { Request } from 'express';
import { ODataService } from 'j2utils';
import { ODataResult } from 'shared/interfaces';
import { getConnection, getManager } from 'typeorm';

import { IJobOrderDto } from './IJobOrderDto';

export class JobOrdersRepository {
    public async GetJobOrders(request: Request): Promise<ODataResult<IJobOrderDto>> {
        const projectRepository = getManager().getRepository(StatementOfFactsEntity);

        const query: string = projectRepository
            .createQueryBuilder('sof')
            .select([
                'sof.ProjectUid AS ProjectUid',
                'sof.uid AS StatementOfFactsUid',
                'sof.Fact AS Fact',
                'cast(sof.DateAndTime as datetimeoffset) AS DateAndTime',
            ])
            .where('sof.ActiveStatus = 1')
            .getQuery();

        const oDataService = new ODataService(request, getConnection);

        return oDataService.getJoinResult(query);
    }
}
