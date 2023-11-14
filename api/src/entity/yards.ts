import { Column, Entity, OneToMany } from 'typeorm';

import { BaseDatesEntity } from './baseDatesEntity';
import { yards_projects } from './yards_projects';

@Entity('yards', { schema: 'dry_dock' })
export class yards extends BaseDatesEntity {
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
    yard_name: string | null;

    @Column('varchar', {
        nullable: true,
        name: 'yard_location',
        length: 200,
    })
    yard_location: string | null;

    @OneToMany(() => yards_projects, (yard_projects) => yard_projects.yard)
    YardProjects: yards_projects[];
}
