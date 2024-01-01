/* eslint-disable @typescript-eslint/naming-convention */
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { JobOrderStatus } from '../../dal/drydock/projects/job-orders/JobOrderStatus';
import { BaseDatesEntity } from '../baseDatesEntity';

@Entity('daily_report_updates', { schema: 'dry_dock' })
export class DailyReportUpdatesEntity extends BaseDatesEntity {
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

    @Column('uuid', {
        nullable: false,
        name: 'specification_uid',
    })
    SpecificationUid: string;

    @Column('varchar', {
        nullable: true,
        name: 'status',
        length: 50,
    })
    Status: JobOrderStatus;

    @Column('int', {
        nullable: false,
        name: 'progress',
    })
    Progress: number;

    @Column('varchar', {
        nullable: true,
        name: 'remark',
        length: 5000,
    })
    Remark: string;
}
