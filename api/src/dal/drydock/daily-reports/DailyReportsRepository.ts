import { Request } from 'express';
import { DataUtilService, ODataService } from 'j2utils';
import { getConnection, getManager, QueryRunner } from 'typeorm';

import { JobOrdersUpdatesDto } from '../../../application-layer/drydock/daily-reports/dtos/JobOrdersUpdatesDto';
import { DailyReportsEntity } from '../../../entity/drydock/DailyReportsEntity';
import { DailyReportUpdateEntity } from '../../../entity/drydock/DailyReportUpdateEntity';
import { ODataResult } from '../../../shared/interfaces';
import { ICreateDailyReportRemarkDto } from './dtos/ICreateDailyReportRemarkDto';
import { ICreateDailyReportsDto } from './dtos/ICreateDailyReportsDto';
import { IDailyReportsResultDto } from './dtos/IDailyReportsResultDto';
import { IDeleteDailyReportsDto } from './dtos/IDeleteDailyReportsDto';
import { IOneDailyReportsResultDto } from './dtos/IOneDailyReportsResultDto';
import { IUpdateDailyReportsDto } from './dtos/IUpdateDailyReportsDto';

export class DailyReportsRepository {
    public async findOneByDailyReportUid(uid: string): Promise<IOneDailyReportsResultDto> {
        const dailyReportsRepository = getManager().getRepository(DailyReportsEntity);
        return dailyReportsRepository
            .createQueryBuilder('dr')
            .select([
                'dr.uid as uid',
                'dr.ReportName as reportName',
                'dr.ReportDate as reportDate',
                'dr.JobOrdersUpdate as jobOrdersUpdate',
            ])
            .where(`dr.uid = '${uid}' and dr.active_status = 1`)
            .getRawOne();
    }

    public async findReportRemarks(uid: string): Promise<Array<JobOrdersUpdatesDto>> {
        const remarksRepository = getManager().getRepository(DailyReportUpdateEntity);

        return remarksRepository
            .createQueryBuilder('rem')
            .select(['rem.uid as uid', 'rem.ReportUpdateName as reportUpdateName', 'rem.Remark as remark'])
            .where(`rem.report_uid = '${uid}' and rem.active_status = 1`)
            .getRawMany();
    }

    public async getDailyReports(data: Request): Promise<ODataResult<IDailyReportsResultDto>> {
        const dailyReportsRepository = getManager().getRepository(DailyReportsEntity);

        const query: string = dailyReportsRepository
            .createQueryBuilder('dr')
            .select([
                'dr.uid as uid',
                'dr.ReportName as reportName',
                'dr.ReportDate as reportDate',
                'dr.ProjectUid as projectUid',
            ])
            .where('dr.active_status = 1')
            .getQuery();
        const oDataService = new ODataService(data, getConnection);
        return oDataService.getJoinResult(query);
    }

    public async createDailyReport(data: ICreateDailyReportsDto, queryRunner: QueryRunner) {
        data.CreatedAt = new Date();
        data.ActiveStatus = true;

        //TODO: think how to return uid from insert request, why it return undefined?
        data.uid = new DataUtilService().newUid();
        await queryRunner.manager.insert(DailyReportsEntity, data);
        return data.uid;
    }

    public async CreateReportRemark(data: Array<ICreateDailyReportRemarkDto>, queryRunner: QueryRunner) {
        return queryRunner.manager.insert(DailyReportUpdateEntity, data);
    }

    public async updateDailyReport(data: IUpdateDailyReportsDto, queryRunner: QueryRunner) {
        const uid = data.DailyReportUid;
        const dailyReportsRepository = queryRunner.manager.getRepository(DailyReportsEntity);
        return dailyReportsRepository
            .createQueryBuilder('yp')
            .update(DailyReportsEntity)
            .set({
                ReportName: data.ReportName,
                updated_by: data.UserUid,
                updated_at: data.UpdatedAt,
            })
            .where('uid = :uid', { uid })
            .execute();
    }

    public async deleteDailyReport(data: IDeleteDailyReportsDto, queryRunner: QueryRunner) {
        const uid = data.DailyReportUid;
        const dailyReportsRepository = queryRunner.manager.getRepository(DailyReportsEntity);
        return dailyReportsRepository
            .createQueryBuilder('yp')
            .update(DailyReportsEntity)
            .set({
                active_status: false,
                deleted_by: data.UserUid,
                deleted_at: data.DeletedAt,
            })
            .where('uid = :uid', { uid })
            .execute();
    }
}
