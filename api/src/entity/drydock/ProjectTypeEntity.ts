import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('project_type', { schema: 'dry_dock' })
export class ProjectTypeEntity {
    @PrimaryGeneratedColumn()
    uid: string;

    @Column('varchar', {
        nullable: true,
        name: 'Worklist_Type',
        length: 50,
    })
    WorklistType: string;

    @Column('varchar', {
        nullable: true,
        name: 'short_code',
        length: 50,
    })
    ShortCode: string;

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
    ActiveStatus: boolean;
}
