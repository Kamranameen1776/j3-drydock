import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('project_type', { schema: 'dry_dock' })
export class ProjectTypeEntity {
    @PrimaryGeneratedColumn()
    id: string;

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
}
