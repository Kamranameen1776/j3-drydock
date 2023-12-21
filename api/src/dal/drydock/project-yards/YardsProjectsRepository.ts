import { DataUtilService } from 'j2utils';
import { getManager, QueryRunner } from 'typeorm';

import { className } from '../../../common/drydock/ts-helpers/className';
import { J3PrcCompanyRegistryEntity, YardsProjectsEntity } from '../../../entity/drydock';
import { ICreateProjectYardsDto } from './dtos/ICreateProjectYardsDto';
import { IDeleteProjectYardsDto } from './dtos/IDeleteProjectYardsDto';
import { IProjectYardsResultDto } from './dtos/IProjectYardsResultDto';
import { IProjectYardsValidationDto } from './dtos/IProjectYardsValidationDto';
import { IUpdateProjectYardsDto } from './dtos/IUpdateProjectYardsDto';

export class YardsProjectsRepository {
    public async getAllByProject(uid: string): Promise<IProjectYardsResultDto[]> {
        const yardProjectsRepository = getManager().getRepository(YardsProjectsEntity);
        return yardProjectsRepository
            .createQueryBuilder('yp')
            .leftJoin(className(J3PrcCompanyRegistryEntity), 'cr', 'cr.uid = yp.yard_uid')
            .select(
                `yp.uid as uid,
                yp.project_uid as projectUid,
                yp.yard_uid as yardUid,
                cr.registeredName as yardName,
                cr.country + ', ' + cr.city as yardLocation,
                cast(yp.last_exported_date as datetimeoffset) AS lastExportedDate,
                yp.is_selected as isSelected`,
            )
            .where('yp.active_status = 1 and yp.project_uid = :uid', { uid })
            .execute();
    }

    public async get(uid: string): Promise<IProjectYardsValidationDto> {
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

    public async create(data: ICreateProjectYardsDto, queryRunner: QueryRunner): Promise<string[]> {
        const yardProjects: YardsProjectsEntity[] = data.yardsUids.map((yardUid) =>
            this.createYardProject(yardUid, data),
        );
        const yardProjectsRepository = queryRunner.manager.getRepository(YardsProjectsEntity);
        await yardProjectsRepository
            .createQueryBuilder('yp')
            .insert()
            .into(YardsProjectsEntity)
            .values(yardProjects)
            .execute();
        return yardProjects.map((item) => item.uid);
    }

    private createYardProject(yardUid: string, data: ICreateProjectYardsDto): YardsProjectsEntity {
        const yardProjects = new YardsProjectsEntity();
        yardProjects.uid = new DataUtilService().newUid();
        yardProjects.project_uid = data.projectUid;
        yardProjects.yard_uid = yardUid;
        yardProjects.is_selected = false;
        yardProjects.created_by = data.createdBy;
        yardProjects.created_at = data.createdAt;
        yardProjects.active_status = true;
        return yardProjects;
    }

    public async update(data: IUpdateProjectYardsDto, queryRunner: QueryRunner) {
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

    public async delete(data: IDeleteProjectYardsDto, queryRunner: QueryRunner) {
        const uid = data.uid;
        const yardProjectsRepository = queryRunner.manager.getRepository(YardsProjectsEntity);
        return yardProjectsRepository
            .createQueryBuilder('yp')
            .update(YardsProjectsEntity)
            .set({
                active_status: false,
                deleted_at: data.deletedAt,
                deleted_by: data.deletedBy,
            })
            .where('uid = :uid', { uid })
            .execute();
    }

    public async ListSelectedProjectYardsByProjectUid(projectUid: string): Promise<YardsProjectsEntity[]> {
        const yardProjectsRepository = getManager().getRepository(YardsProjectsEntity);
        return yardProjectsRepository.find({
            where: {
                project_uid: projectUid,
                is_selected: true,
                active_status: true,
            },
        });
    }

    public async TryGetProjectYardByYardUid(yardUid: string): Promise<YardsProjectsEntity | undefined> {
        const yardProjectsRepository = getManager().getRepository(YardsProjectsEntity);
        return yardProjectsRepository.findOne({
            where: {
                yard_uid: yardUid,
                active_status: true,
            },
        });
    }

    public async SaveProjectYard(yardsProjectsEntity: YardsProjectsEntity, queryRunner: QueryRunner) {
        await queryRunner.manager.save(yardsProjectsEntity);
    }
}
