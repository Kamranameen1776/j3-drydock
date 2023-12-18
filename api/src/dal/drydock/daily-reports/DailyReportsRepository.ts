import { Request } from 'express';
import { DataUtilService, ODataService } from 'j2utils';
import { getConnection, getManager, QueryRunner } from 'typeorm';

import { JobOrdersUpdateDto } from '../../../application-layer/drydock/daily-reports/dtos/JobOrdersUpdateDto';
import { DailyReportsEntity } from '../../../entity/drydock/DailyReportsEntity';
import { DailyReportUpdateEntity } from '../../../entity/drydock/DailyReportUpdateEntity';
import { ODataResult } from '../../../shared/interfaces';
import { ICreateDailyReportUpdateDto } from './dtos/ICreateDailyReportRemarkDto';
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
            .select(['dr.uid as uid', 'dr.ReportName as reportName', 'dr.ReportDate as reportDate'])
            .where(`dr.uid = '${uid}' and dr.active_status = 1`)
            .getRawOne();
    }

    public async findDailyReportUpdate(uid: string): Promise<Array<JobOrdersUpdateDto>> {
        const dailyReportUpdateRepository = getManager().getRepository(DailyReportUpdateEntity);

        return dailyReportUpdateRepository
            .createQueryBuilder('dru')
            .select(['dru.uid as updateUid', 'dru.ReportUpdateName as reportUpdateName', 'dru.Remark as remark'])
            .where(`dru.report_uid = '${uid}' and dru.active_status = 1`)
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
        data.uid = new DataUtilService().newUid();
        await queryRunner.manager.insert(DailyReportsEntity, data);
        return data.uid;
    }

    public async createDailyReportUpdate(data: Array<ICreateDailyReportUpdateDto>, queryRunner: QueryRunner) {
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
