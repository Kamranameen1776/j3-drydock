import { Request } from 'express';
import { ODataService } from 'j2utils';
import { getConnection, getManager, QueryRunner } from 'typeorm';

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
                'sd.uid AS SpecificationUid',
                'sd.ProjectUid AS ProjectUid',
                'jo.uid AS JobOrderUid',
                'tm.Code AS Code',
                'jo.Subject AS Subject',
                'its.DisplayName as ItemSource',
                'jo.Status AS Status',
                'jo.Remarks AS Remarks',
                'jo.Progress AS Progress',
                // TODO: take from SpecificationDetails -> AssignedTo property, once it is implemented
                "'-' AS Responsible",
                'jo.LastUpdated AS LastUpdated',
                'tm.Status AS SpecificationStatus',
                'sd.StartDate AS SpecificationStartDate',
                'sd.Subject AS SpecificationSubject',
                // TODO: implement once end date is implemented in specification details page
                //'sd.EndDate AS SpecificationEndDate',
            ])
            .innerJoin(className(ProjectEntity), 'p', 'p.uid = sd.ProjectUid and p.ActiveStatus = 1')
            .innerJoin(className(TecTaskManagerEntity), 'tm', 'sd.TecTaskManagerUid = tm.uid and tm.ActiveStatus = 1')
            .leftJoin(className(JobOrderEntity), 'jo', 'sd.uid = jo.SpecificationUid and jo.ActiveStatus = 1')

            // TODO: change to inner join once item source is implemented, see WI 677735
            .leftJoin(className(LibItemSourceEntity), 'its', 'sd.ItemSourceUid = its.uid and its.ActiveStatus = 1')

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
