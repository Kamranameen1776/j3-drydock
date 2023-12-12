/* eslint-disable @typescript-eslint/naming-convention */
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { BaseDatesEntity } from '../baseDatesEntity';

@Entity('daily_reports', { schema: 'dry_dock' })
export class DailyReportsEntity extends BaseDatesEntity {
    @PrimaryGeneratedColumn('uuid')
    uid: string;

    @Column('uniqueidentifier', {
        nullable: true,
        name: 'project_uid',
    })
    project_uid: string;

    @Column('varchar', {
        nullable: false,
        name: 'report_name',
        length: 200,
    })
    report_name: string;

    @Column('datetimeoffset', {
        nullable: false,
        name: 'report_date',
    })
    report_date: Date;

    @Column('varchar', {
        nullable: true,
        name: 'description',
        length: 5000,
    })
    description: string;
}
