import { getManager, QueryRunner } from 'typeorm';

import { className } from '../../../common/drydock/ts-helpers/className';
import { YardProjectsEntity } from '../../../entity/yard_to_project';
import { YardsEntity } from '../../../entity/yards';
import { ICreateYardProjectsDto } from './dtos/ICreateYardProjectsDto';
import { IUpdateYardProjectsDto } from './dtos/IUpdateYardProjectsDto';
import { IYardProjectsResultDto } from './dtos/IYardProjectsResultDto';

export class YardProjectsRepository {
    public async getYardProjects(uid: string): Promise<IYardProjectsResultDto> {
        const yardProjectsRepository = getManager().getRepository(YardProjectsEntity);

        return await yardProjectsRepository
            .createQueryBuilder('yp')
            .select(
                `yp.uid as uid,
                yp.project_uid as projectUid,
                yp.yard_uid as yardUid,
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
            .where(`yp.active_status = 1 and yp.project_uid = '${uid}'`)
            .execute();
    }

    public async createYardProjects(data: ICreateYardProjectsDto, createdBy: string) {
        const yardProjectsRepository = getManager().getRepository(YardProjectsEntity);
        await yardProjectsRepository
            .createQueryBuilder('yp')
            .insert()
            .into(YardProjectsEntity)
            .values(
                data.yardUid.map((item) => {
                    const yardProjects = new YardProjectsEntity();
                    yardProjects.Uid = item;
                    yardProjects.ProjectUid = data.projectUid;
                    yardProjects.YardUid = item;
                    yardProjects.IsSelected = false;
                    yardProjects.CreatedBy = createdBy;
                    yardProjects.CreatedAt = new Date();
                    yardProjects.ActiveStatus = true;
                    return yardProjects;
                }),
            )
            .execute();
        return;
    }

    public async updateYardProjects(data: IUpdateYardProjectsDto, queryRunner: QueryRunner) {
        const yardProjects = new YardProjectsEntity();
        yardProjects.Uid = data.uid;
        yardProjects.YardUid = data.yardUid;
        yardProjects.LastExportedDate = data.lastExportedDate;
        yardProjects.IsSelected = data.isSelected;
        return await queryRunner.manager.update(YardProjectsEntity, yardProjects.Uid, yardProjects);
    }

    public async deleteYardProjects(uid: string, deletedBy: string) {
        const yardProjectsRepository = getManager().getRepository(YardProjectsEntity);
        return await yardProjectsRepository
            .createQueryBuilder('yp')
            .update(YardProjectsEntity)
            .set({
                ActiveStatus: false,
                DeletedAt: new Date(),
                DeletedBy: deletedBy,
            })
            .where(`uid = '${uid}'`)
            .execute();
    }
}
