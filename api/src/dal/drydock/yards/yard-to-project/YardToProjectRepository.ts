import { getManager, QueryRunner } from 'typeorm';

import { YardToProjectEntity } from '../../../../entity/yard_to_project';
import { IUpdateYardToProjectDto } from './dtos/IUpdateYardToProjectDto';

export class YardToProjectRepository {
    public async getYardsToProject(projectUid: string): Promise<YardToProjectEntity> {
        const result = getManager()
            .createQueryBuilder('yard_to_project', 'yp')
            .leftJoin('yards', 'yd', 'yd.uid = yp.yard_uid')
            .select(
                `yp.uid as uid,
                yd.yard_name as yardName,
                yd.yard_location as yardLocation,
                yp.last_exported_date as lastExportedDate,
                yp.is_selected as isSelected,
                yp.active_status as activeStatus,
                yp.created_by as createdBy,
                yp.created_at as createdAt,
                yp.deleted_by as deletedBy,
                yp.deleted_at as deletedAt`,
            )
            .where(`yd.active_status = 1 and yp.active_status = 1 and yp.project_uid = '${projectUid}'`)
            .execute();
        return result;
    }

    public async UpdateYardToProject(data: IUpdateYardToProjectDto, queryRunner: QueryRunner) {
        const projectYard = new YardToProjectEntity();
        projectYard.Uid = data.uid;
        projectYard.YardUid = data.yardUid;
        projectYard.LastExportedDate = data.lastExportedDate;
        projectYard.IsSelected = data.isSelected;
        return await queryRunner.manager.update(YardToProjectEntity, projectYard.Uid, projectYard);
    }

    public async DeleteYardToProject(yardToPeojectUid: string, queryRunner: QueryRunner) {
        const yardToProjectData = new YardToProjectEntity();
        yardToProjectData.ActiveStatus = false;
        yardToProjectData.DeletedAt = new Date();
        return await queryRunner.manager.update(YardToProjectEntity, yardToPeojectUid, yardToProjectData);
    }
}
