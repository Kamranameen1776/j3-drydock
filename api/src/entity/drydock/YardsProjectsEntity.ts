import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, RelationId } from 'typeorm';

import { BaseDatesEntity } from '../baseDatesEntity';
import { YardsEntity } from './YardsEntity';

@Entity('yards_projects', { schema: 'dry_dock' })
export class YardsProjectsEntity extends BaseDatesEntity {
    @PrimaryGeneratedColumn('uuid')
    uid: string;

    @Column('uniqueidentifier', {
        primary: true,
        name: 'project_uid',
    })
    project_uid: string;

    @OneToOne(() => YardsEntity, (yard) => yard.YardProjects)
    @JoinColumn({
        name: 'yard_uid',
    })
    yard: Partial<YardsEntity>;
    @RelationId((entity: YardsProjectsEntity) => entity.yard)
    yard_uid: string;

    @Column('datetime', {
        nullable: true,
        name: 'last_exported_date',
    })
    last_exported_date: Date;

    @Column('bit', {
        nullable: true,
        name: 'is_selected',
    })
    is_selected: boolean;
}
