import { Request } from 'express';
import { ODataService } from 'j2utils';
import { getConnection, getManager, QueryRunner } from 'typeorm';

import { className } from '../../../../common/drydock/ts-helpers/className';
import {
    JmsDtlWorkflowConfigDetailsEntity,
    LibItemSourceEntity,
    LibUserEntity,
    ProjectEntity,
    SpecificationDetailsEntity,
    TecTaskManagerEntity,
    TmDdLibDoneBy,
} from '../../../../entity/drydock';
import { JmsDtlWorkflowConfigEntity } from '../../../../entity/drydock/dbo/JMSDTLWorkflowConfigEntity';
import { JobOrderEntity } from '../../../../entity/drydock/JobOrderEntity';
import { TaskManagerConstants } from '../../../../shared/constants';
import { ODataResult } from '../../../../shared/interfaces';
import { IJobOrderDto } from './IJobOrderDto';

export class JobOrdersRepository {
    private statuses: Array<string> = [
        TaskManagerConstants.specification.status.Planned,
        TaskManagerConstants.specification.status.Closed,
    ];
    public async GetJobOrders(request: Request): Promise<ODataResult<IJobOrderDto>> {
        const SpecificationDetailsRepository = getManager().getRepository(SpecificationDetailsEntity);

        const query: string = SpecificationDetailsRepository.createQueryBuilder('sd')
            .select([
                'sd.uid AS SpecificationUid',
                'sd.ProjectUid AS ProjectUid',
                'tm.Code AS Code',
                'its.DisplayName as ItemSource',
                'jo.Progress AS Progress',
                'jo.LastUpdated AS LastUpdated',
                'wdetails.StatusDisplayName AS SpecificationStatus',
                'sd.Subject AS SpecificationSubject',
                'sd.StartDate as SpecificationStartDate',
                'sd.EndDate as SpecificationEndDate',
                'db.displayName as DoneBy',
            ])
            .innerJoin(className(ProjectEntity), 'p', 'p.uid = sd.ProjectUid and p.ActiveStatus = 1')
            .innerJoin(className(TecTaskManagerEntity), 'tm', 'sd.TecTaskManagerUid = tm.uid and tm.ActiveStatus = 1 ')
            .innerJoin(className(JmsDtlWorkflowConfigEntity), 'wc', `wc.job_type = 'Specification'`)
            .innerJoin(
                className(JmsDtlWorkflowConfigDetailsEntity),
                'wdetails',
                `wdetails.ConfigId = wc.ID AND wdetails.WorkflowTypeID = tm.Status
                AND tm.Status IN ('${this.statuses.join(`','`)}')`,
            )
            .innerJoin(className(LibItemSourceEntity), 'its', 'sd.ItemSourceUid = its.uid and its.ActiveStatus = 1')
            .leftJoin(className(JobOrderEntity), 'jo', 'sd.uid = jo.SpecificationUid and jo.ActiveStatus = 1')
            .leftJoin(className(TmDdLibDoneBy), 'db', 'sd.DoneByUid = db.uid')

            .getQuery();

        const oDataService = new ODataService(request, getConnection);

        return oDataService.getJoinResult(query);
    }

    public async GetUpdates(request: Request): Promise<ODataResult<IJobOrderDto>> {
        const SpecificationDetailsRepository = getManager().getRepository(JobOrderEntity);

        const query: string = SpecificationDetailsRepository.createQueryBuilder('jo')
            .select([
                'sd.uid AS SpecificationUid',
                'sd.ProjectUid AS ProjectUid',
                'tm.Code AS Code',
                'its.DisplayName as ItemSource',
                "usr.FirstName + ' ' + usr.LastName AS Responsible",
                'wdetails.StatusDisplayName AS SpecificationStatus',
                'sd.Subject AS SpecificationSubject',
                'sd.StartDate as SpecificationStartDate',
                'sd.EndDate as SpecificationEndDate',
                'jo.Subject as JobOrderSubject',
                'jo.Remarks as JobOrderRemarks',
                'jo.Status as JobOrderStatus',
                'jo.LastUpdated AS LastUpdated',
                'jo.Progress AS Progress',
            ])
            .innerJoin(
                className(SpecificationDetailsEntity),
                'sd',
                'sd.uid = jo.SpecificationUid and jo.ActiveStatus = 1',
            )
            .innerJoin(className(ProjectEntity), 'p', 'p.uid = sd.ProjectUid and p.ActiveStatus = 1')
            .innerJoin(className(TecTaskManagerEntity), 'tm', 'sd.TecTaskManagerUid = tm.uid and tm.ActiveStatus = 1')
            .innerJoin(className(JmsDtlWorkflowConfigEntity), 'wc', `wc.job_type = 'Specification'`)
            .innerJoin(
                className(JmsDtlWorkflowConfigDetailsEntity),
                'wdetails',
                `wdetails.ConfigId = wc.ID AND wdetails.WorkflowTypeID = tm.Status
                AND tm.Status IN ('${this.statuses.join(`','`)}')`,
            )
            .innerJoin(className(LibItemSourceEntity), 'its', 'sd.ItemSourceUid = its.uid and its.ActiveStatus = 1')
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
