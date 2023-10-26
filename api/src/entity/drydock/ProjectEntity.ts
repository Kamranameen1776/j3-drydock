import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, RelationId } from 'typeorm';

@Entity('project', { schema: 'dry_dock' })
export class ProjectEntity {
    @PrimaryGeneratedColumn('uuid')
    uid: string;

    @Column('varchar', {
        nullable: true,
        name: 'project_code',
        length: 250,
    })
    ProjectCode: string;

    @Column('bit', {
        name: 'created_at_office',
        default: true,
        nullable: false,
    })
    CreatedAtOffice: boolean;

    @Column('uniqueidentifier', {
        nullable: false,
        name: 'Vessel_Uid',
    })
    VesselUid: string;

    @Column('uniqueidentifier', {
        nullable: false,
        name: 'project_type_uid',
    })
    ProjectTypeUid: string;

    @Column('int', {
        nullable: false,
        name: 'project_state_id',
    })
    ProjectStateId: number;

    @Column('varchar', {
        nullable: false,
        name: 'subject',
        length: 250,
    })
    Subject: string;

    @Column('uniqueidentifier', {
        name: 'project_manager_Uid',
        nullable: false,
    })
    ProjectManagerUid: string;

    @Column('datetime2', {
        nullable: true,
        name: 'start_date',
    })
    StartDate: Date;

    @Column('datetime2', {
        nullable: true,
        name: 'end_date',
    })
    EndDate: Date;

    @Column('datetime2', {
        nullable: true,
        name: 'created_at',
    })
    CreatedAt: Date;

    @Column('bit', {
        nullable: true,
        name: 'active_status',
    })
    ActiveStatus: boolean;

    @Column('uniqueidentifier', {
        nullable: false,
        name: 'task_manager_uid',
    })
    TaskManagerUid: string;
}
