import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, RelationId } from 'typeorm';

import { yards } from './yards';

//todo: rename to low case & table name
@Entity('yard_to_project', { schema: 'dry_dock' })
export class yards_projects {
    @PrimaryGeneratedColumn('uuid')
    uid: string;

    @Column('uniqueidentifier', {
        primary: true,
        name: 'project_uid',
    })
    ProjectUid: string;

    @OneToOne(() => yards, (yard) => yard.YardProjects)
    @JoinColumn({
        name: 'yard_uid',
    })
    yard: Partial<yards>;
    @RelationId((entity: yards_projects) => entity.yard)
    YardUid: string;

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
    CreatedBy: string;

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
