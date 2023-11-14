import { Column, Entity, OneToMany } from 'typeorm';

import { yards_projects } from './yards_projects';

@Entity('yards', { schema: 'dry_dock' })
export class yards {
    @Column('uniqueidentifier', {
        nullable: false,
        primary: true,
        name: 'uid',
    })
    uid: string;

    @Column('varchar', {
        nullable: true,
        name: 'yard_name',
        length: 200,
    })
    YardName: string | null;

    @Column('varchar', {
        nullable: true,
        name: 'yard_location',
        length: 200,
    })
    YardLocation: string | null;

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

    @OneToMany(() => yards_projects, (yard_projects) => yard_projects.yard)
    YardProjects: yards_projects[];
}
