import { Request } from 'express';
import { DataUtilService, ODataService } from 'j2utils';
import { getConnection, getManager, QueryRunner } from 'typeorm';

import { DailyReportsEntity } from '../../../entity/drydock/DailyReportsEntity';
import { ODataResult } from '../../../shared/interfaces';
import { ICreateDailyReportsDto } from './dtos/ICreateDailyReportsDto';
import { IDailyReportsResultDto } from './dtos/IDailyReportsResultDto';
import { IDeleteDailyReportsDto } from './dtos/IDeleteDailyReportsDto';
import { IUpdateDailyReportsDto } from './dtos/IUpdateDailyReportsDto';

export class DailyReportsRepository {
    public async getDailyReports(data: Request): Promise<ODataResult<IDailyReportsResultDto>> {
        const dailyReportsRepository = getManager().getRepository(DailyReportsEntity);

        const query: string = dailyReportsRepository
            .createQueryBuilder('dr')
            .select([
                'dr.Uid AS uid',
                'dr.ProjectUid AS projectUid',
                'dr.ReportName AS reportName',
                'dr.ReportDate AS reportDate',
            ])
            .where('dr.active_status = 1')
            .getQuery();
        const oDataService = new ODataService(data, getConnection);
        return oDataService.getJoinResult(query);
    }

    public async createDailyReport(data: ICreateDailyReportsDto, queryRunner: QueryRunner) {
        const dailyReportsRepository = queryRunner.manager.getRepository(DailyReportsEntity);
        await dailyReportsRepository
            .createQueryBuilder('dr')
            .insert()
            .into(DailyReportsEntity)
            .values({
                Uid: new DataUtilService().newUid(),
                ProjectUid: data.ProjectUid,
                ReportName: data.ReportName,
                ReportDate: data.ReportDate,
                Description: data.Description,
                created_by: data.UserUid,
                created_at: data.CreatedAt,
                active_status: true,
            })
            .execute();
    }

    public async updateDailyReport(data: IUpdateDailyReportsDto, queryRunner: QueryRunner) {
        const uid = data.DailyReportUid;
        const dailyReportsRepository = queryRunner.manager.getRepository(DailyReportsEntity);
        return dailyReportsRepository
            .createQueryBuilder('yp')
            .update(DailyReportsEntity)
            .set({
                ReportName: data.ReportName,
                Description: data.Description,
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
