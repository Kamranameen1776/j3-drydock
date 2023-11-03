import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('yard', { schema: 'dry_dock' })
export class YardEntity {
    @PrimaryGeneratedColumn('uuid')
    uid: string;

    @Column('varchar', {
        nullable: true,
        name: 'yard_name',
        length: 400,
    })
    YardName: string;

    @Column('varchar', {
        nullable: true,
        name: 'yard_location',
        length: 400,
    })
    YardLocation: string;

    @Column('varchar', {
        nullable: true,
        name: 'export_status',
        length: 200,
    })
    ExportStatus: string;

    @Column('varchar', {
        nullable: true,
        name: 'import_status',
        length: 200,
    })
    ImportStatus: string;

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
}
