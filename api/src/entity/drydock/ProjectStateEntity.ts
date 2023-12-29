import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('project_state', { schema: 'dry_dock' })
export class ProjectStateEntity {
    @PrimaryGeneratedColumn()
    id: string;

    @Column('varchar', {
        nullable: false,
        name: 'project_state_name',
        length: 250,
    })
    ProjectStateName: string;

    @Column('uniqueidentifier', {
        nullable: false,
        name: 'project_type_uid',
    })
    ProjectTypeUid: string;

    @Column('datetimeoffset', {
        nullable: true,
        name: 'created_at',
        default: () => 'getutcdate()()',
    })
    CreatedAt: Date | null;

    @Column('bit', {
        nullable: true,
        name: 'active_status',
    })
    ActiveStatus: number;
}
