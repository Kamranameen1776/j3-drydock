import { Column, Entity } from 'typeorm';

@Entity('yards', { schema: 'dry_dock' })
export class YardsEntity {
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
