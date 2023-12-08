import { Request } from 'express';
import { ODataService } from 'j2utils';
import { getConnection, getManager } from 'typeorm';

import { className } from '../../../../common/drydock/ts-helpers/className';
import {
    LibItemSourceEntity,
    ProjectEntity,
    SpecificationDetailsEntity,
    TecTaskManagerEntity,
} from '../../../../entity/drydock';
import { JobOrderEntity } from '../../../../entity/drydock/JobOrderEntity';
import { ODataResult } from '../../../../shared/interfaces';
import { IJobOrderDto } from './IJobOrderDto';

export class JobOrdersRepository {
    public async GetJobOrders(request: Request): Promise<ODataResult<IJobOrderDto>> {
        const SpecificationDetailsRepository = getManager().getRepository(SpecificationDetailsEntity);

        const query: string = SpecificationDetailsRepository.createQueryBuilder('sd')
            .select([
                'jo.uid AS JobOrderUid',
                'jo.SpecificationUid AS SpecificationUid',
                'tm.Code AS Code',
                'jo.Subject AS Subject',
                'its.DisplayName as ItemSource',
                'jo.Status AS Status',
                'jo.Remarks AS Remarks',
                'jo.Progress AS Progress',
                // TODO: take from SpecificationDetails -> AssignedTo property, once it is implemented
                "'-' AS Responsible",
                'jo.LastUpdated AS LastUpdated',

                'sd.ProjectUid AS ProjectUid',
            ])
            .innerJoin(className(ProjectEntity), 'p', 'p.uid = sd.ProjectUid and p.ActiveStatus = 1')
            .leftJoin(className(JobOrderEntity), 'jo', 'sd.uid = jo.SpecificationUid and jo.ActiveStatus = 1')
            .leftJoin(className(TecTaskManagerEntity), 'tm', 'sd.TecTaskManagerUid = tm.uid and tm.ActiveStatus = 1')
            .leftJoin(className(LibItemSourceEntity), 'its', 'sd.ItemSourceUid = its.uid and its.ActiveStatus = 1')
            .getQuery();

        const oDataService = new ODataService(request, getConnection);

        return oDataService.getJoinResult(query);
    }
}
