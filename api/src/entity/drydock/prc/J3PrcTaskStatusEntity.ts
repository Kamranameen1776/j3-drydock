import { Column, Entity, Index } from 'typeorm';

export enum WorkflowType {
    'RAISE' = 'RAISE',
    'IN PROGRESS' = 'IN PROGRESS',
    'REVIEW' = 'REVIEW',
    'CLOSE' = 'CLOSE',
    'COMPLETE' = 'COMPLETE',
}

@Index('PK_j3_prc_task_status_uid', ['uid'], { unique: true })
@Entity('j3_prc_task_status', { schema: 'prc' })
export class J3PrcTaskStatusEntity {
    @Column('uniqueidentifier', { primary: true, name: 'uid' })
    uid: string;

    @Column('uniqueidentifier', {
        name: 'object_uid',
    })
    objectUid: string;

    @Column('uniqueidentifier', {
        name: 'task_uid',
    })
    taskUid: string;

    @Column('varchar', { name: 'status_display_name', length: 100 })
    statusDisplayName: string | null;

    @Column('varchar', { name: 'status_id', length: 100, nullable: true })
    statusId: WorkflowType | null;

    @Column('datetime', { name: 'step_due_date', nullable: true })
    stepDueDate: Date | null;

    @Column('varchar', { name: 'approver_role', length: 100, nullable: true })
    approverRole: string | null;

    @Column('varchar', { name: 'reason', length: 2000, nullable: true })
    reason: string | null;

    @Column('varchar', { name: 'activity', nullable: true, length: 500 })
    activity: string | null;

    @Column('bit', {
        name: 'active_status',
        nullable: true,
        default: () => '(1)',
    })
    activeStatus: boolean | null;

    @Column('datetimeoffset', {
        name: 'timestamp',
        nullable: true,
        default: () => 'getutcdate()()',
    })
    timestamp: Date | null;
}
