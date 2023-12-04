import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('JMS_DTL_Workflow_config', { schema: 'dbo' })
export class JmsDtlWorkflowConfigEntity {
    @PrimaryGeneratedColumn()
    id: string;

    @Column('varchar', {
        nullable: true,
        name: 'job_type',
        length: 50,
    })
    JobType: string;
}
