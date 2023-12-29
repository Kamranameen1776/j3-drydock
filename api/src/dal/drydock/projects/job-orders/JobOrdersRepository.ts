import { Request } from 'express';
import { ODataService } from 'j2utils';
import { getConnection, getManager, QueryRunner } from 'typeorm';

import { className } from '../../../../common/drydock/ts-helpers/className';
import {
    LibItemSourceEntity,
    LibUserEntity,
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
                'sd.uid AS SpecificationUid',
                'sd.ProjectUid AS ProjectUid',
                'tm.Code AS Code',
                'its.DisplayName as ItemSource',
                'jo.Progress AS Progress',
                "usr.FirstName + ' ' + usr.LastName AS Responsible",
                'jo.LastUpdated AS LastUpdated',
                'tm.Status AS SpecificationStatus',
                'sd.Subject AS SpecificationSubject',
                'sd.StartDate as SpecificationStartDate',
                'sd.EndDate as SpecificationEndDate',
            ])
            .innerJoin(className(ProjectEntity), 'p', 'p.uid = sd.ProjectUid and p.ActiveStatus = 1')
            .innerJoin(className(TecTaskManagerEntity), 'tm', 'sd.TecTaskManagerUid = tm.uid and tm.ActiveStatus = 1')
            .innerJoin(className(LibItemSourceEntity), 'its', 'sd.ItemSourceUid = its.uid and its.ActiveStatus = 1')
            .leftJoin(className(JobOrderEntity), 'jo', 'sd.uid = jo.SpecificationUid and jo.ActiveStatus = 1')
            .leftJoin(className(LibUserEntity), 'usr', 'sd.DoneByUid = usr.uid and usr.ActiveStatus = 1')

            .getQuery();

        const oDataService = new ODataService(request, getConnection);

        return oDataService.getJoinResult(query);
    }

    public async TryGetJobOrderBySpecification(specificationUid: string): Promise<JobOrderEntity | undefined> {
        const jobOrdersRepository = getManager().getRepository(JobOrderEntity);

        const jobOrder = await jobOrdersRepository.findOne({
            where: {
                SpecificationUid: specificationUid,
            },
        });

        return jobOrder;
    }

    public async UpdateJobOrder(jobOrder: JobOrderEntity, queryRunner: QueryRunner): Promise<void> {
        await queryRunner.manager.save(jobOrder);
    }
}
