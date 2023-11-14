import { DataUtilService } from 'j2utils';
import { getManager, QueryRunner } from 'typeorm';

import { yards_projects } from '../../../entity/yards_projects';
import { ICreateProjectYardsDto } from './dtos/ICreateProjectYardsDto';
import { IProjectYardsResultDto } from './dtos/IProjectYardsResultDto';
import { IUpdateProjectYardsDto } from './dtos/IUpdateProjectYardsDto';

export class YardsProjectsRepository {
    public async getAllByProject(uid: string): Promise<IProjectYardsResultDto> {
        const yardProjectsRepository = getManager().getRepository(yards_projects);

        return await yardProjectsRepository
            .createQueryBuilder('yp')
            .leftJoinAndSelect('yp.yard', 'y')
            .select(
                `yp.uid as uid,
                yp.project_uid as projectUid,
                yp.yard_uid as yardUid,
                y.YardName as yardName,
                y.YardLocation as yardLocation,
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
            yardProjects.ProjectUid = data.projectUid;
            yardProjects.yard = {
                uid: yardUid,
            };
            yardProjects.IsSelected = false;
            yardProjects.CreatedBy = data.createdBy;
            yardProjects.CreatedAt = new Date();
            yardProjects.ActiveStatus = true;
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
        return await yardProjectsRepository
            .createQueryBuilder('yp')
            .update(yards_projects)
            .set({
                LastExportedDate: data.lastExportedDate,
                IsSelected: data.isSelected,
            })
            .where(`uid = '${data.uid}'`)
            .execute();
    }

    public async delete(uid: string, deletedBy: string, queryRunner: QueryRunner) {
        const yardProjectsRepository = queryRunner.manager.getRepository(yards_projects);
        return await yardProjectsRepository
            .createQueryBuilder('yp')
            .update(yards_projects)
            .set({
                ActiveStatus: false,
                DeletedAt: new Date(),
                DeletedBy: deletedBy,
            })
            .where(`uid = '${uid}'`)
            .execute();
    }
}
