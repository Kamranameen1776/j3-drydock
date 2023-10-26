import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tec_task_manager', { schema: 'dbo' })
export class TECTaskManagerEntity {
    @PrimaryGeneratedColumn()
    uid: string;

    @Column('varchar', {
        nullable: true,
        name: 'task_status',
        length: 50,
    })
    Status: string;

    @Column('varchar', {
        nullable: true,
        name: 'job_card_no',
        length: 50,
    })
    Code: string;

    @Column('bit', {
        nullable: true,
        name: 'Active_Status',
    })
    ActiveStatus: boolean;
}
