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
            .select(['dr.uid AS uid', 'dr.report_name AS reportName', 'dr.description AS description'])
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
                uid: new DataUtilService().newUid(),
                report_name: data.reportName,
                report_date: data.reportDate,
                description: data.description,
                created_by: data.createdBy,
                created_at: data.createdAt,
                active_status: true,
            })
            .execute();
    }

    public async updateDailyReport(data: IUpdateDailyReportsDto, queryRunner: QueryRunner) {
        const uid = data.uid;
        const dailyReportsRepository = queryRunner.manager.getRepository(DailyReportsEntity);
        return dailyReportsRepository
            .createQueryBuilder('yp')
            .update(DailyReportsEntity)
            .set({
                report_name: data.reportName,
                description: data.description,
                updated_by: data.updatedBy,
                updated_at: data.updatedAt,
            })
            .where('uid = :uid', { uid })
            .execute();
    }

    public async deleteDailyReport(data: IDeleteDailyReportsDto, queryRunner: QueryRunner) {
        const uid = data.uid;
        const dailyReportsRepository = queryRunner.manager.getRepository(DailyReportsEntity);
        return dailyReportsRepository
            .createQueryBuilder('yp')
            .update(DailyReportsEntity)
            .set({
                active_status: false,
                deleted_at: data.deletedAt,
                deleted_by: data.deletedBy,
            })
            .where('uid = :uid', { uid })
            .execute();
    }
}
