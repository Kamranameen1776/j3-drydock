import { DataUtilService } from 'j2utils';
import { getManager, QueryRunner } from 'typeorm';

import { className } from '../../../common/drydock/ts-helpers/className';
import { YardProjectsEntity } from '../../../entity/yard_to_project';
import { YardsEntity } from '../../../entity/yards';
import { ICreateYardProjectsDto } from './dtos/ICreateYardProjectsDto';
import { IUpdateYardProjectsDto } from './dtos/IUpdateYardProjectsDto';

export class YardProjectsRepository {
    //public async getYardProjects(projectUid: string): Promise<YardProjectsEntity> {
    public async getYardProjects(projectUid: string): Promise<void> {
        const yardProjectsRepository = getManager().getRepository(YardProjectsEntity);

        return await yardProjectsRepository
            .createQueryBuilder('yp')
            .select(
                `yp.uid as uid,
                yp.project_uid as projectUid,
                y.YardName as yardName,
                y.YardLocation as yardLocation,
                yp.last_exported_date as lastExportedDate,
                yp.is_selected as isSelected,
                yp.active_status as activeStatus,
                yp.created_by as createdBy,
                yp.created_at as createdAt,
                yp.deleted_by as deletedBy,
                yp.deleted_at as deletedAt`,
            )
            .leftJoin(className(YardsEntity), 'y', 'yp.yard_uid = y.uid')
            .where(`yp.active_status = 1 and yp.project_uid = '${projectUid}'`)
            .execute();
    }

    public async CreateYardProjects(
        yardUid: string,
        data: ICreateYardProjectsDto,
        createdBy: string,
        queryRunner: QueryRunner,
    ) {
        const yardProjects = new YardProjectsEntity();
        yardProjects.Uid = data?.uid ? data.uid : new DataUtilService().newUid();
        yardProjects.ProjectUid = data.projectUid;
        yardProjects.YardUid = yardUid;
        yardProjects.LastExportedDate = data.lastExportedDate;
        yardProjects.IsSelected = data.isSelected;
        yardProjects.CreatedBy = createdBy;
        yardProjects.CreatedAt = new Date();
        yardProjects.ActiveStatus = true;
        return await queryRunner.manager.insert(YardProjectsEntity, yardProjects);
    }

    public async UpdateYardProjects(data: IUpdateYardProjectsDto, queryRunner: QueryRunner) {
        const yardProjects = new YardProjectsEntity();
        yardProjects.Uid = data.uid;
        yardProjects.YardUid = data.yardUid;
        yardProjects.LastExportedDate = data.lastExportedDate;
        yardProjects.IsSelected = data.isSelected;
        return await queryRunner.manager.update(YardProjectsEntity, yardProjects.Uid, yardProjects);
    }

    public async DeleteYardProjects(uid: string, deletedBy: string, queryRunner: QueryRunner) {
        const yardProjects = new YardProjectsEntity();
        yardProjects.ActiveStatus = false;
        yardProjects.DeletedAt = new Date();
        yardProjects.DeletedBy = deletedBy;
        return await queryRunner.manager.update(YardProjectsEntity, uid, yardProjects);
    }
}
