import { Request } from 'express';
import { DataUtilService, ODataService } from 'j2utils';
import { getConnection, getManager, QueryRunner } from 'typeorm';

import { className } from '../../../common/drydock/ts-helpers/className';
import { LibUserEntity, SpecificationDetailsEntity, TecTaskManagerEntity } from '../../../entity/drydock';
import { DailyReportsEntity } from '../../../entity/drydock/DailyReportsEntity';
import { DailyReportUpdatesEntity } from '../../../entity/drydock/DailyReportUpdatesEntity';
import { ODataResult } from '../../../shared/interfaces';
import { ICreateDailyReportUpdateDto } from './dtos/ICreateDailyReportRemarkDto';
import { ICreateDailyReportsDto } from './dtos/ICreateDailyReportsDto';
import { IDailyReportsResultDto } from './dtos/IDailyReportsResultDto';
import { IDeleteDailyReportsDto } from './dtos/IDeleteDailyReportsDto';
import { IDeleteDailyReportUpdatesDto } from './dtos/IDeleteDailyReportUpdatesDto';
import { IOneDailyReportsResultDto } from './dtos/IOneDailyReportsResultDto';
import { IUpdateDailyReportsDto } from './dtos/IUpdateDailyReportsDto';
import { JobOrdersUpdatesDto } from './dtos/JobOrdersUpdatesDto';

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
            ])
            .where('dr.active_status = 1 and dr.uid = :uid', { uid })
            .getRawOne();
    }

    public async findDailyReportUpdates(reportUid: string): Promise<Array<JobOrdersUpdatesDto>> {
        const dailyReportUpdateRepository = getManager().getRepository(DailyReportUpdatesEntity);

        return dailyReportUpdateRepository
            .createQueryBuilder('dru')
            .select([
                'dru.uid as uid',
                'dru.ReportUpdateName as name',
                'dru.Remark as remark',
                'dru.SpecificationUid as specificationUid',
                'tm.Code AS specificationCode',
                'dru.Status as status',
                'sd.Subject AS specificationSubject',
                "usr.FirstName + ' ' + usr.LastName AS updatedBy",
                'dru.Progress as progress',
                'dru.updated_at as lastUpdated',
            ])
            .leftJoin(className(LibUserEntity), 'usr', 'dru.updated_by = usr.uid and usr.ActiveStatus = 1')
            .leftJoin(
                className(SpecificationDetailsEntity),
                'sd',
                'dru.SpecificationUid = sd.uid and sd.ActiveStatus = 1',
            )
            .leftJoin(className(TecTaskManagerEntity), 'tm', 'sd.TecTaskManagerUid = tm.uid and tm.ActiveStatus = 1')
            .where(`dru.active_status = 1 and dru.ReportUid = :reportUid`, { reportUid })
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
        const uid = new DataUtilService().newUid();
        await queryRunner.manager.insert(DailyReportsEntity, {
            ...data,
            active_status: true,
            uid,
            created_by: data.CreatedBy,
            created_at: new Date(),
        });
        return {
            uid,
        };
    }

    public async createDailyReportUpdate(data: Array<ICreateDailyReportUpdateDto>, queryRunner: QueryRunner) {
        const result = await queryRunner.manager.insert(DailyReportUpdatesEntity, data);
        return result;
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
            })
            .where('uid = :uid', { uid })
            .execute();
    }

    public async deleteDailyReportUpdates(data: IDeleteDailyReportUpdatesDto, queryRunner: QueryRunner) {
        const dailyReportUpdatesRepository = queryRunner.manager.getRepository(DailyReportUpdatesEntity);
        return dailyReportUpdatesRepository
            .createQueryBuilder('dru')
            .update(DailyReportUpdatesEntity)
            .set({
                active_status: false,
                deleted_by: data.UserUid,
                deleted_at: data.DeletedAt,
            })
            .where('ReportUid = :report_uid', { report_uid: data.ReportUid })
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
