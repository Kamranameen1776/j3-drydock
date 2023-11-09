import { Column, Entity } from 'typeorm';

@Entity('yard_to_project', { schema: 'dry_dock' })
export class YardProjectsEntity {
    @Column('uniqueidentifier', {
        nullable: false,
        primary: true,
        name: 'uid',
    })
    Uid: string;

    @Column('uniqueidentifier', {
        primary: true,
        name: 'project_uid',
    })
    ProjectUid: string;

    @Column('uniqueidentifier', {
        primary: true,
        name: 'yard_uids',
    })
    YardUids: [];

    @Column('datetime', {
        nullable: true,
        name: 'last_exported_date',
    })
    LastExportedDate: Date;

    @Column('bit', {
        nullable: true,
        name: 'is_selected',
    })
    IsSelected: boolean;

    @Column('bit', {
        nullable: true,
        name: 'active_status',
    })
    ActiveStatus: boolean;

    @Column('uniqueidentifier', {
        nullable: true,
        name: 'created_by',
    })
    CreatedByUid: string;

    @Column('datetime', {
        nullable: true,
        name: 'created_at',
    })
    CreatedAt: Date;

    @Column('uniqueidentifier', {
        nullable: true,
        name: 'deleted_by',
    })
    DeletedBy: string;

    @Column('datetime', {
        nullable: true,
        name: 'deleted_at',
    })
    DeletedAt: Date;
}
