import { DailyReportsEntity } from 'entity/drydock/DailyReportsEntity';
import { DataUtilService } from 'j2utils';
import { getManager, QueryRunner } from 'typeorm';

import { YardsProjectsEntity } from '../../../entity/drydock';
import { ICreateDailyReportsDto } from './dtos/ICreateDailyReportsDto';
import { IDailyReportsResultDto } from './dtos/IDailyReportsResultDto';
import { IDeleteDailyReportsDto } from './dtos/IDeleteDailyReportsDto';
import { IUpdateDailyReportsDto } from './dtos/IUpdateDailyReportsDto';

export class DailyReportsRepository {
    public async getAllByProject(uid: string): Promise<IDailyReportsResultDto[]> {
        const yardProjectsRepository = getManager().getRepository(YardsProjectsEntity);
        return yardProjectsRepository
            .createQueryBuilder('yp')
            .leftJoinAndSelect('yp.yard', 'y')
            .select(
                `yp.uid as uid,
                yp.project_uid as projectUid,
                yp.yard_uid as yardUid,
                y.yard_name as yardName,
                y.yard_location as yardLocation,
                cast(yp.last_exported_date as datetimeoffset) AS lastExportedDate,
                yp.is_selected as isSelected`,
            )
            .where('yp.active_status = 1 and yp.project_uid = :uid', { uid })
            .execute();
    }

    public async get(uid: string): Promise<IDailyReportsResultDto> {
        const yardProjectsRepository = getManager().getRepository(YardsProjectsEntity);
        return yardProjectsRepository
            .createQueryBuilder('yp')
            .select(
                `yp.uid as uid,
                yp.project_uid as projectUid,
                yp.yard_uid as yardUid,
                yp.is_selected as isSelected,
                yp.last_exported_date as lastExportedDate,
                yp.active_status as activeStatus`,
            )
            .where('yp.uid = :uid', { uid })
            .getRawOne();
    }

    public async create(data: ICreateDailyReportsDto, queryRunner: QueryRunner) {
        const dailyReportsRepository = queryRunner.manager.getRepository(DailyReportsEntity);
        await dailyReportsRepository
            .createQueryBuilder('dr')
            .insert()
            .into(DailyReportsEntity)
            .values({
                uid: new DataUtilService().newUid(),
                report_name: data.reportName,
                description: data.description,
                created_by: data.createdBy,
                created_at: data.createdAt,
                active_status: true,
            })
            .execute();
    }

    public async update(data: IUpdateDailyReportsDto, queryRunner: QueryRunner) {
        const uid = data.uid;
        const yardProjectsRepository = queryRunner.manager.getRepository(YardsProjectsEntity);
        return yardProjectsRepository
            .createQueryBuilder('yp')
            .update(YardsProjectsEntity)
            .set({
                last_exported_date: data.lastExportedDate,
                is_selected: data.isSelected,
                updated_at: data.updatedAt,
                updated_by: data.updatedBy,
            })
            .where('uid = :uid', { uid })
            .execute();
    }

    public async delete(data: IDeleteDailyReportsDto, queryRunner: QueryRunner) {
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
