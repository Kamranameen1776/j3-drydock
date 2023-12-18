/* eslint-disable @typescript-eslint/naming-convention */
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { BaseDatesEntity } from '../baseDatesEntity';

@Entity('daily_report_update', { schema: 'dry_dock' })
export class DailyReportUpdateEntity extends BaseDatesEntity {
    @PrimaryGeneratedColumn('uuid')
    uid: string;

    @Column('uniqueidentifier', {
        nullable: true,
        name: 'report_uid',
    })
    ReportUid: string;

    @Column('varchar', {
        nullable: false,
        name: 'report_update_name',
        length: 200,
    })
    ReportUpdateName: string;

    @Column('varchar', {
        nullable: true,
        name: 'remark',
        length: 5000,
    })
    Remark: string;
}
