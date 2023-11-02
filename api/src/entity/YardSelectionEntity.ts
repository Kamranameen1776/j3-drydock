import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('yard_selection', { schema: 'dry_dock' })
export class YardSelectionEntity {
    @PrimaryGeneratedColumn('uuid')
    uid: string;

    @Column('varchar', {
        nullable: true,
        name: 'yard_name',
        length: 400,
    })
    yard_name: string;

    @Column('varchar', {
        nullable: true,
        name: 'yard_location',
        length: 400,
    })
    yard_location: string;

    @Column('varchar', {
        nullable: true,
        name: 'export_status',
        length: 200,
    })
    export_status: string;

    @Column('varchar', {
        nullable: true,
        name: 'import_status',
        length: 200,
    })
    import_status: string;

    @Column('bit', {
        nullable: true,
        name: 'active_status',
    })
    active_status: boolean;

    @Column('uniqueidentifier', {
        nullable: true,
        name: 'created_by',
    })
    created_by_uid: string;

    @Column('datetime', {
        nullable: true,
        name: 'created_at',
    })
    created_at: Date;
}
