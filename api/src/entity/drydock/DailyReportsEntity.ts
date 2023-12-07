/* eslint-disable @typescript-eslint/naming-convention */
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { BaseDatesEntity } from '../baseDatesEntity';

@Entity('daily_reports', { schema: 'dry_dock' })
export class DailyReportsEntity extends BaseDatesEntity {
    @PrimaryGeneratedColumn('uuid')
    uid: string;

    @Column('varchar', {
        primary: true,
        name: 'report_name',
        length: 200,
    })
    report_name: string;

    @Column('datetime', {
        nullable: true,
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
