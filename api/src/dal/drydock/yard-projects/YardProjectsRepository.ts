import { DataUtilService } from 'j2utils';
import { getManager, QueryRunner } from 'typeorm';

import { YardProjectsEntity } from '../../../entity/yard_to_project';
import { ICreateYardProjectsDto } from './dtos/ICreateYardProjectsDto';
import { IUpdateYardProjectsDto } from './dtos/IUpdateYardProjectsDto';

export class YardProjectsRepository {
    //public async getYardProjects(projectUid: string): Promise<YardProjectsEntity> {
    public async getYardProjects(projectUid: string): Promise<void> {
        const yardProjectsRepository = getManager().getRepository(YardProjectsEntity);
        let result;
        return result;
        // return await yardProjectsRepository
        //     .createQueryBuilder('yard_to_project', 'yp')
        //     .leftJoin('yards', 'y', 'yp.yard_uid = y.uid')
        //     .select(
        //         `yp.uid as uid,
        //         yp.project_uid as projectUid,
        //         y.YardName as yardName,
        //         y.YardLocation as yardLocation,
        //         yp.last_exported_date as lastExportedDate,
        //         yp.is_selected as isSelected,
        //         yp.active_status as activeStatus,
        //         yp.created_by as createdBy,
        //         yp.created_at as createdAt,
        //         yp.deleted_by as deletedBy,
        //         yp.deleted_at as deletedAt`,
        //     )
        //     .where(`yp.active_status = 1 and yp.project_uid = '${projectUid}'`)
        //     .execute();
    }

    public async CreateYardProjects(data: ICreateYardProjectsDto, queryRunner: QueryRunner) {
        const yardProjects = new YardProjectsEntity();
        yardProjects.Uid = data?.uid ? data.uid : new DataUtilService().newUid();
        yardProjects.ProjectUid = data.projectUid;
        yardProjects.YardUids = data.yardUids;
        yardProjects.LastExportedDate = data.lastExportedDate;
        yardProjects.IsSelected = data.isSelected;
        yardProjects.CreatedByUid = data.createdBy;
        yardProjects.CreatedAt = new Date();
        yardProjects.ActiveStatus = true;
        return await queryRunner.manager.insert(YardProjectsEntity, yardProjects);
    }

    public async UpdateYardProjects(data: IUpdateYardProjectsDto, queryRunner: QueryRunner) {
        const yardProjects = new YardProjectsEntity();
        yardProjects.Uid = data.uid;
        yardProjects.YardUids = data.yardUids;
        yardProjects.LastExportedDate = data.lastExportedDate;
        yardProjects.IsSelected = data.isSelected;
        return await queryRunner.manager.update(YardProjectsEntity, yardProjects.Uid, yardProjects);
    }

    public async DeleteYardProjects(uid: string, queryRunner: QueryRunner) {
        const yardProjects = new YardProjectsEntity();
        yardProjects.ActiveStatus = false;
        yardProjects.DeletedAt = new Date();
        return await queryRunner.manager.update(YardProjectsEntity, uid, yardProjects);
    }
}
