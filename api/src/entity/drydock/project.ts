import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, RelationId } from 'typeorm';

@Entity('project', { schema: 'dry_dock' })
export class ProjectsEntity {
    @PrimaryGeneratedColumn('uuid')
    uid: string;

    @Column('varchar', {
        nullable: true,
        name: 'project_code',
        length: 250,
    })
    ProjectCode: string;

    @Column('bit',{
        name: 'created_at_office',
        default: true,
        nullable: false,
    })
    CreatedAtOffice: boolean;

    @Column('int',{
        nullable: false,
        name: 'Vessel_Id',
    })
    VesselId: number;
    
    @Column('int',{
        nullable: false,
        name: 'project_type_id',
    })
    ProjectTypeId: number;

    @Column('int',{
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

    @Column('datetime', {
        nullable: true,
        name: 'start_date',
    })
    StartDate: Date;

    @Column('datetime', {
        nullable: true,
        name: 'end_date',
    })
    EndDate: Date;

    @Column('datetime', {
        nullable: true,
        name: 'created_at',
    })
    CreatedAt: Date;

    @Column('datetime', {
        nullable: true,
        name: 'deleted_at',
    })
    DeletedAt: Date;
}
