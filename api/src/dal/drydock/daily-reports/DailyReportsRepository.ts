import { Request } from 'express';
import { DataUtilService, ODataService } from 'j2utils';
import { getConnection, getManager, QueryRunner } from 'typeorm';

import { DailyReportsEntity } from '../../../entity/drydock/DailyReportsEntity';
import { ODataResult } from '../../../shared/interfaces';
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
                'dr.ProjectUid as projectUid',
                'dr.created_at as createdAt',
                'dr.created_by as createdBy',
                'dr.body as body',
            ])
            .where('dr.active_status = 1 and dr.uid = :uid', { uid })
            .getRawOne();
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
        const uid = new DataUtilService().newUid();
        await queryRunner.manager.insert(DailyReportsEntity, {
            ...data,
            active_status: true,
            uid,
            created_by: data.CreatedBy,
            created_at: new Date(),
            Body: data.Body,
        });
        return {
            uid,
        };
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
                updated_at: new Date(),
                Body: data.Body,
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
