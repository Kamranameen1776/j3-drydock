import { DataUtilService } from 'j2utils';
import { getManager, QueryRunner } from 'typeorm';

import { YardToProjectEntity } from '../../../../entity/yard_to_project';
import { ICreateLinkedYardsDto } from './dtos/ICreateLinkedYardsDto';

export class LinkedYardsRepository {
    public async getLinkedYards(projectUid: string): Promise<YardToProjectEntity> {
        const result = getManager()
            .createQueryBuilder('yard_to_project', 'yp')
            .select(
                `yp.uid as uid,
                yp.project_uid as projectUid,
                yp.yard_uid as yardUid,
                yp.last_exported_date as lastExportedDate,
                yp.is_selected as isSelected,
                yp.active_status as activeStatus,
                yp.created_by as createdBy,
                yp.created_at as createdAt,
                yp.deleted_by as deletedBy,
                yp.deleted_at as deletedAt`,
            )
            .where(`yp.active_status = 1 and yp.project_uid = '${projectUid}'`)
            .execute();
        return result;
    }

    public async CreateLinkedYards(data: ICreateLinkedYardsDto, queryRunner: QueryRunner) {
        const linkedYards = new YardToProjectEntity();
        linkedYards.Uid = data?.uid ? data.uid : new DataUtilService().newUid();
        linkedYards.ProjectUid = data.projectUid;
        linkedYards.YardUid = data.yardUid;
        linkedYards.LastExportedDate = data.lastExportedDate;
        linkedYards.IsSelected = data.isSelected;
        linkedYards.CreatedByUid = data.createdBy;
        linkedYards.CreatedAt = new Date();
        linkedYards.ActiveStatus = true;
        return await queryRunner.manager.insert(YardToProjectEntity, linkedYards);
    }
}
