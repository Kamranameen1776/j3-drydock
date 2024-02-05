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
import { Req } from '../../../../common/drydock/ts-helpers/req-res';
import { GetJobOrdersDto } from '../../../../application-layer/drydock/projects/job-orders/dtos/GetJobOrdersDto';

export class JobOrdersRepository {
    private statuses: Array<string> = [
        TaskManagerConstants.specification.status.Planned,
        TaskManagerConstants.specification.status.Closed,
    ];

    public async GetJobOrders(
        request: Request,
        statuses: string[] | null = this.statuses,
    ): Promise<ODataResult<IJobOrderDto>> {
        const SpecificationDetailsRepository = getManager().getRepository(SpecificationDetailsEntity);

        let query = SpecificationDetailsRepository.createQueryBuilder('sd')
            .select([
                'sd.uid AS SpecificationUid',
                'sd.ProjectUid AS ProjectUid',
                'tm.Code AS Code',
                'its.DisplayName as ItemSource',
                'jo.Progress AS Progress',
                'jo.LastUpdated AS LastUpdated',
                'tm.Status AS SpecificationStatusCode',
                'wdetails.StatusDisplayName AS SpecificationStatus',
                'sd.Subject AS SpecificationSubject',
                'ISNULL(sd.StartDate, p.StartDate) as SpecificationStartDate',
                'ISNULL(sd.EndDate, p.EndDate) as SpecificationEndDate',
                "usr.FirstName + ' ' + usr.LastName AS Responsible",
                'jo.uid AS JobOrderUid',
            ])
            .innerJoin(className(ProjectEntity), 'p', 'p.uid = sd.ProjectUid and p.ActiveStatus = 1')
            .innerJoin(className(TecTaskManagerEntity), 'tm', 'sd.TecTaskManagerUid = tm.uid')
            .innerJoin(className(JmsDtlWorkflowConfigEntity), 'wc', `wc.job_type = 'Specification'`) //TODO: strange merge, but Specifications doesn't have type. probably should stay that way
            .innerJoin(className(LibItemSourceEntity), 'its', 'sd.ItemSourceUid = its.uid and its.ActiveStatus = 1')
            .leftJoin(className(LibUserEntity), 'usr', 'p.project_manager_Uid = usr.uid and usr.ActiveStatus = 1')
            .leftJoin(className(TmDdLibDoneBy), 'db', 'sd.DoneByUid = db.uid and sd.ActiveStatus = 1')
            .leftJoin(className(JobOrderEntity), 'jo', 'sd.uid = jo.SpecificationUid and jo.ActiveStatus = 1');

        if (statuses) {
            query = query.innerJoin(
                className(JmsDtlWorkflowConfigDetailsEntity),
                'wdetails',
                `wdetails.ConfigId = wc.ID AND wdetails.WorkflowTypeID = tm.Status AND tm.Status IN ('${this.statuses.join(
                    `','`,
                )}')`,
            );
        } else {
            query = query
                .innerJoin(
                    className(JmsDtlWorkflowConfigDetailsEntity),
                    'wdetails',
                    'wdetails.ConfigId = wc.ID AND wdetails.WorkflowTypeID = tm.Status',
                )
                .groupBy(
                    [
                        'sd.uid',
                        'sd.project_uid',
                        'tm.job_card_no',
                        'its.display_name',
                        'jo.progress',
                        'jo.last_updated',
                        'tm.task_status',
                        'wdetails.status_display_name',
                        'sd.Subject',
                        'sd.start_date',
                        'sd.end_date',
                        'db.displayName',
                    ].join(','),
                );
        }

        const oDataService = new ODataService(request, getConnection);

        return oDataService.getJoinResult(query.getQuery());
    }

    public async GetUpdates(request: Req<GetJobOrdersDto>): Promise<ODataResult<IJobOrderDto>> {
        const SpecificationDetailsRepository = getManager().getRepository(JobOrderEntity);

        const [query, parameters] = SpecificationDetailsRepository.createQueryBuilder('jo')
            .select([
                'sd.uid AS SpecificationUid',
                'sd.ProjectUid AS ProjectUid',
                'tm.Code AS Code',
                'its.DisplayName as ItemSource',
                "usr.FirstName + ' ' + usr.LastName AS Responsible",
                'wdetails.StatusDisplayName AS SpecificationStatus',
                'sd.Subject AS SpecificationSubject',
                'ISNULL(sd.StartDate, p.StartDate) as SpecificationStartDate',
                'ISNULL(sd.EndDate, p.EndDate) as SpecificationEndDate',
                'jo.Subject as JobOrderSubject',
                'jo.Remarks as JobOrderRemarks',
                'jo.Status as JobOrderStatus',
                'jo.LastUpdated AS LastUpdated',
                'jo.Progress AS Progress',
            ])
            .innerJoin(
                className(SpecificationDetailsEntity),
                'sd',
                'sd.uid = jo.SpecificationUid and jo.ActiveStatus = 1 and sd.ActiveStatus = 1',
                { SpecificationUid: request.body.uid }
            )
            .innerJoin(className(ProjectEntity), 'p', 'p.uid = sd.ProjectUid and p.ActiveStatus = 1')
            .innerJoin(className(TecTaskManagerEntity), 'tm', 'sd.TecTaskManagerUid = tm.uid and tm.ActiveStatus = 1')
            .innerJoin(className(LibUserEntity), 'usr', 'p.project_manager_Uid = usr.uid and usr.ActiveStatus = 1')
            .innerJoin(className(JmsDtlWorkflowConfigEntity), 'wc', `wc.job_type = 'Specification'`)
            .innerJoin(
                className(JmsDtlWorkflowConfigDetailsEntity),
                'wdetails',
                `wdetails.ConfigId = wc.ID AND wdetails.WorkflowTypeID = tm.Status
                AND tm.Status IN ('${this.statuses.join(`','`)}')`,
            )
            .innerJoin(className(LibItemSourceEntity), 'its', 'sd.ItemSourceUid = its.uid and its.ActiveStatus = 1')
            .leftJoin(className(TmDdLibDoneBy), 'db', 'sd.DoneByUid = db.uid and sd.ActiveStatus = 1')
            .where('jo.SpecificationUid = :SpecificationUid', { SpecificationUid: request.body.uid })
            .getQueryAndParameters();

        const oDataService = new ODataService(request, getConnection);

        return oDataService.getJoinResult(query, parameters);
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
