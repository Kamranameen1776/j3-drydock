/* eslint-disable @typescript-eslint/naming-convention */
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { BaseDatesEntity } from '../baseDatesEntity';

@Entity('yards_projects', { schema: 'dry_dock' })
export class YardsProjectsEntity extends BaseDatesEntity {
    @PrimaryGeneratedColumn('uuid')
    uid: string;

    @Column('uniqueidentifier', {
        primary: true,
        name: 'project_uid',
    })
    project_uid: string;

    @Column('uniqueidentifier', {
        name: 'yard_uid',
    })
    yard_uid: string;

    @Column('datetimeoffset', {
        nullable: true,
        name: 'last_exported_date',
    })
    last_exported_date: Date | null;

    @Column('bit', {
        nullable: true,
        name: 'is_selected',
    })
    is_selected: boolean;
}
