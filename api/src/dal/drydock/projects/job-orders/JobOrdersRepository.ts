import { Request } from 'express';
import { ODataService } from 'j2utils';
import { ODataResult } from 'shared/interfaces';
import { getConnection, getManager } from 'typeorm';

import { className } from '../../../../common/drydock/ts-helpers/className';
import { ProjectEntity, SpecificationDetailsEntity } from '../../../../entity/drydock';
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
                'sd.ItemSourceUid AS ItemSource',
                'jo.Status AS Status',
                'jo.Remarks AS Remarks',
                'jo.Progress AS Progress',
                '123 AS Responsible',
                'jo.LastUpdated AS LastUpdated',

                'sd.ProjectUid AS ProjectUid',
            ])
            .innerJoin(className(ProjectEntity), 'p', 'p.uid = jo.ProjectUid')
            .innerJoin(className(SpecificationDetailsEntity), 'sd', 'sd.uid = jo.SpecificationUid')
            .where('jo.ActiveStatus = 1')
            .where('jou.ActiveStatus = 1')
            .where('p.ActiveStatus = 1')
            .where('sd.ActiveStatus = 1')
            .getQuery();

        const oDataService = new ODataService(request, getConnection);

        return oDataService.getJoinResult(query);
    }
}
