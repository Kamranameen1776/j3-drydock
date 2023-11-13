import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { GroupProjectStatusId } from '../../bll/drydock/projects/Project/GroupProjectStatusId';

@Entity('group_project_status', { schema: 'dry_dock' })
export class GroupProjectStatusEntity {
    @PrimaryGeneratedColumn()
    uid: string;

    @Column('varchar', {
        nullable: true,
        name: 'group_status_id',
        length: 50,
    })
    GroupProjectStatusId: GroupProjectStatusId;

    @Column('varchar', {
        nullable: true,
        name: 'Worklist_Type',
        length: 50,
    })
    ProjectTypeId: string;

    @Column('varchar', {
        nullable: true,
        name: 'WorkFlowType_ID',
        length: 50,
    })
    ProjectStatusId: string;

    @Column('bit', {
        nullable: true,
        name: 'active_status',
    })
    ActiveStatus: boolean;
}
