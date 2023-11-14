import { DataUtilService } from 'j2utils';
import { getManager } from 'typeorm';

import { yard_projects } from '../../../entity/yard_projects';
import { ICreateYardProjectsDto } from './dtos/ICreateYardProjectsDto';
import { IUpdateYardProjectsDto } from './dtos/IUpdateYardProjectsDto';
import { IYardProjectsResultDto } from './dtos/IYardProjectsResultDto';

export class YardProjectsRepository {
    public async getAllByProject(uid: string): Promise<IYardProjectsResultDto> {
        const yardProjectsRepository = getManager().getRepository(yard_projects);

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

    public async createYardProjects(data: ICreateYardProjectsDto) {
        const yardProjects: yard_projects[] = data.projectsUids.map((projectUid) => {
            const yardProjects = new yard_projects();
            yardProjects.uid = new DataUtilService().newUid();
            yardProjects.ProjectUid = projectUid;
            yardProjects.yard = {
                uid: data.yardUid,
            };
            yardProjects.IsSelected = false;
            yardProjects.CreatedBy = data.createdBy;
            yardProjects.CreatedAt = new Date();
            yardProjects.ActiveStatus = true;
            return yardProjects;
        });

        const yardProjectsRepository = getManager().getRepository(yard_projects);
        await yardProjectsRepository
            .createQueryBuilder('yp')
            .insert()
            .into(yard_projects)
            .values(yardProjects)
            .execute();
        return;
    }

    public async updateYardProjects(data: IUpdateYardProjectsDto) {
        const yardProjectsRepository = getManager().getRepository(yard_projects);
        return await yardProjectsRepository
            .createQueryBuilder('yp')
            .update(yard_projects)
            .set({
                LastExportedDate: data.lastExportedDate,
                IsSelected: data.isSelected,
            })
            .where(`uid = '${data.uid}'`)
            .execute();
    }

    public async deleteYardProjects(uid: string, deletedBy: string) {
        const yardProjectsRepository = getManager().getRepository(yard_projects);
        return await yardProjectsRepository
            .createQueryBuilder('yp')
            .update(yard_projects)
            .set({
                ActiveStatus: false,
                DeletedAt: new Date(),
                DeletedBy: deletedBy,
            })
            .where(`uid = '${uid}'`)
            .execute();
    }
}
