import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('project_state', { schema: 'dry_dock' })
export class ProjectState {
    @PrimaryGeneratedColumn()
    id: string;

    @Column('varchar', {
        nullable: false,
        name: 'project_state_name',
        length: 250,
    })
    ProjectStateName: string;

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
