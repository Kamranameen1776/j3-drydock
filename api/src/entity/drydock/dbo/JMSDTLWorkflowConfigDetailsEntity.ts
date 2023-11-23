import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('JMS_DTL_Workflow_config_Details', { schema: 'dbo' })
export class JmsDtlWorkflowConfigDetailsEntity {
    @PrimaryGeneratedColumn()
    id: string;

    @Column('varchar', {
        nullable: true,
        name: 'Worklist_Type',
        length: 50,
    })
    WorklistType: string;

    @Column('varchar', {
        nullable: true,
        name: 'status_display_name',
        length: 100,
    })
    StatusDisplayName: string;

    @Column('varchar', {
        nullable: true,
        name: 'WorkflowType_ID',
        length: 100,
    })
    WorkflowTypeID: string;

    @Column('int', {
        nullable: true,
        name: 'Workflow_OrderID',
    })
    WorkflowOrderID: number;

    @Column('int', {
        nullable: true,
        name: 'Config_ID',
    })
    ConfigId: number;

    @Column('bit', {
        nullable: true,
        name: 'Active_Status',
    })
    ActiveStatus: boolean;
}
