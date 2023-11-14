import { DataUtilService } from 'j2utils';
import { getManager, QueryRunner } from 'typeorm';

import { yards_projects } from '../../../entity/yards_projects';
import { ICreateProjectYardsDto } from './dtos/ICreateProjectYardsDto';
import { IDeleteProjectYardsDto } from './dtos/IDeleteProjectYardsDto';
import { IProjectYardsResultDto } from './dtos/IProjectYardsResultDto';
import { IUpdateProjectYardsDto } from './dtos/IUpdateProjectYardsDto';

export class YardsProjectsRepository {
    public async getAllByProject(uid: string): Promise<IProjectYardsResultDto> {
        const yardProjectsRepository = getManager().getRepository(yards_projects);
        return yardProjectsRepository
            .createQueryBuilder('yp')
            .leftJoinAndSelect('yp.yard', 'y')
            .select(
                `yp.uid as uid,
                yp.project_uid as projectUid,
                yp.yard_uid as yardUid,
                y.yard_name as yardName,
                y.yard_location as yardLocation,
                yp.last_exported_date as lastExportedDate,
                yp.is_selected as isSelected`,
            )
            .where(`yp.active_status = 1 and yp.project_uid = '${uid}'`)
            .execute();
    }

    public async create(data: ICreateProjectYardsDto, queryRunner: QueryRunner) {
        const yardProjects: yards_projects[] = data.yardsUids.map((yardUid) => {
            const yardProjects = new yards_projects();
            yardProjects.uid = new DataUtilService().newUid();
            yardProjects.project_uid = data.projectUid;
            yardProjects.yard = {
                uid: yardUid,
            };
            yardProjects.is_selected = false;
            yardProjects.created_by = data.createdBy;
            yardProjects.created_at = new Date();
            yardProjects.active_status = true;
            return yardProjects;
        });

        const yardProjectsRepository = queryRunner.manager.getRepository(yards_projects);
        await yardProjectsRepository
            .createQueryBuilder('yp')
            .insert()
            .into(yards_projects)
            .values(yardProjects)
            .execute();
        return;
    }

    public async update(data: IUpdateProjectYardsDto, queryRunner: QueryRunner) {
        const yardProjectsRepository = queryRunner.manager.getRepository(yards_projects);
        return yardProjectsRepository
            .createQueryBuilder('yp')
            .update(yards_projects)
            .set({
                last_exported_date: data.lastExportedDate,
                is_selected: data.isSelected,
            })
            .where(`uid = '${data.uid}'`)
            .execute();
    }

    public async delete(data: IDeleteProjectYardsDto, queryRunner: QueryRunner) {
        const yardProjectsRepository = queryRunner.manager.getRepository(yards_projects);
        return yardProjectsRepository
            .createQueryBuilder('yp')
            .update(yards_projects)
            .set({
                active_status: false,
                deleted_at: new Date(),
                deleted_by: data.deletedBy,
            })
            .where(`uid = '${data.uid}'`)
            .execute();
    }
}
