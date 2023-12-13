import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { J3PrcRequisition, LibSurveyCertificateAuthority } from './';
import { SpecificationDetailsSubItemEntity } from './SpecificationDetailsSubItemEntity';

@Entity('specification_details', { schema: 'dry_dock' })
export class SpecificationDetailsEntity {
    @PrimaryGeneratedColumn('uuid')
    uid: string;

    @Column('uniqueidentifier', {
        nullable: true,
        name: 'tec_task_manager_uid',
    })
    TecTaskManagerUid: string;

    @Column('uniqueidentifier', {
        nullable: false,
        name: 'function_uid',
    })
    FunctionUid: string;

    @Column('varchar', {
        nullable: false,
        name: 'function',
        length: 250,
    })
    Function: string;

    @Column('varchar', {
        nullable: true,
        name: 'account_code',
        length: 200,
    })
    AccountCode: string;

    @Column('uniqueidentifier', {
        nullable: true,
        name: 'item_source_uid',
    })
    ItemSourceUid: string;

    @Column('varchar', {
        nullable: true,
        name: 'item_number',
        length: 200,
    })
    ItemNumber: string;

    @Column('uniqueidentifier', {
        nullable: true,
        name: 'done_by_uid',
    })
    DoneByUid: string;

    @Column('uniqueidentifier', {
        nullable: false,
        name: 'item_category_uid',
    })
    ItemCategoryUid: string;

    @Column('uniqueidentifier', {
        nullable: true,
        name: 'project_uid',
    })
    ProjectUid: string;

    @Column('varchar', {
        nullable: true,
        name: 'equipment_description',
        length: 200,
    })
    EquipmentDescription: string;

    @Column('uniqueidentifier', {
        nullable: true,
        name: 'priority_uid',
    })
    PriorityUid: string;

    @Column('varchar', {
        nullable: false,
        name: 'description',
        length: 1000,
    })
    Description: string;

    @Column('varchar', {
        nullable: false,
        name: 'subject',
        length: 350,
    })
    Subject: string;

    @Column('datetime', {
        nullable: true,
        name: 'start_date',
    })
    StartDate: Date | null;

    @Column('datetimeoffset', {
        nullable: true,
        name: 'end_date',
    })
    EndDate: Date | null;

    @Column('int', {
        nullable: true,
        name: 'estimated_days',
    })
    EstimatedDays: number;

    @Column('int', {
        nullable: true,
        name: 'buffer_time',
    })
    BufferTime: number;

    @Column('varchar', {
        nullable: true,
        name: 'treatment',
        length: 200,
    })
    Treatment: string;

    @Column('uniqueidentifier', {
        nullable: true,
        name: 'onboard_location_uid',
    })
    OnboardLocationUid: string;

    @Column('varchar', {
        nullable: true,
        name: 'access',
        length: 200,
    })
    Access: string;

    @Column('uniqueidentifier', {
        nullable: true,
        name: 'material_supplied_by_uid',
    })
    MaterialSuppliedByUid: string;

    @Column('varchar', {
        nullable: true,
        name: 'test_criteria',
        length: 200,
    })
    TestCriteria: string;

    @Column('varchar', {
        nullable: true,
        name: 'ppe',
        length: 1000,
    })
    Ppe: string;

    @Column('varchar', {
        nullable: true,
        name: 'safety_instruction',
        length: 1000,
    })
    SafetyInstruction: string;

    @Column('bit', {
        nullable: true,
        name: 'active_status',
    })
    ActiveStatus: boolean;

    @Column('uniqueidentifier', {
        nullable: true,
        name: 'created_by',
    })
    CreatedByUid: string;

    @Column('datetime', {
        nullable: true,
        name: 'created_at',
    })
    CreatedAt: Date;

    @ManyToMany(() => J3PrcRequisition)
    @JoinTable({
        name: 'specification_requisitions',
        schema: 'dry_dock',
        joinColumn: {
            name: 'specification_uid',
            referencedColumnName: 'uid',
        },
        inverseJoinColumn: {
            name: 'requisition_uid',
            referencedColumnName: 'uid',
        },
    })
    requisitions: Partial<J3PrcRequisition>[];

    @OneToMany(() => SpecificationDetailsSubItemEntity, (subItem) => subItem.specificationDetails)
    SubItems: SpecificationDetailsSubItemEntity[];

    @ManyToMany(() => LibSurveyCertificateAuthority)
    @JoinTable({
        name: 'specification_details_LIB_Survey_CertificateAuthority',
        schema: 'dry_dock',
        joinColumn: {
            name: 'specification_details_uid',
            referencedColumnName: 'uid',
        },
        inverseJoinColumn: {
            name: 'LIB_Survey_CertificateAuthority_ID',
            referencedColumnName: 'ID',
        },
    })
    inspections: Partial<LibSurveyCertificateAuthority>[];
}
