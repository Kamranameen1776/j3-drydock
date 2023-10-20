import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('specification_details', { schema: 'dry_dock' })
export class SpecificationDetailsEntity {
    @PrimaryGeneratedColumn('uuid')
    uid: string;

    @Column('uniqueidentifier', {
        nullable: true,
        name: 'function_uid',
    })
    function_uid: string;

    @Column('uniqueidentifier', {
        nullable: true,
        name: 'component_uid',
    })
    component_uid: string;

    @Column('varchar', {
        nullable: true,
        name: 'account_code',
        length: 200,
    })
    account_code: string;

    @Column('uniqueidentifier', {
        nullable: true,
        name: 'item_source',
    })
    item_source: string;

    @Column('varchar', {
        nullable: true,
        name: 'item_number',
        length: 200,
    })
    item_number: string;

    @Column('uniqueidentifier', {
        nullable: true,
        name: 'done_by',
    })
    done_by: string;

    @Column('uniqueidentifier', {
        nullable: true,
        name: 'item_category',
    })
    item_category: string;

    @Column('uniqueidentifier', {
        nullable: true,
        name: 'inspection',
    })
    inspection: string;

    @Column('varchar', {
        nullable: true,
        name: 'equipment_description',
        length: 200,
    })
    equipment_description: string;

    @Column('uniqueidentifier', {
        nullable: true,
        name: 'priority',
    })
    priority: string;

    @Column('varchar', {
        nullable: true,
        name: 'description',
    })
    description: string;

    @Column('datetime', {
        nullable: true,
        name: 'start_date',
    })
    start_date: Date;

    @Column('datetime', {
        nullable: true,
        name: 'estimated_dates',
    })
    estimated_dates: Date;

    @Column('int', {
        nullable: true,
        name: 'buffer_time',
    })
    buffer_time: number;

    @Column('varchar', {
        nullable: true,
        name: 'treatment',
        length: 200,
    })
    treatment: string;

    @Column('varchar', {
        nullable: true,
        name: 'onboard_location',
    })
    onboard_location: string;

    @Column('varchar', {
        nullable: true,
        name: 'access',
        length: 200,
    })
    access: string;

    @Column('uniqueidentifier', {
        nullable: true,
        name: 'material_supplied_by',
    })
    material_supplied_by: string;

    @Column('varchar', {
        nullable: true,
        name: 'test_criteria',
        length: 200,
    })
    test_criteria: string;

    @Column('varchar', {
        nullable: true,
        name: 'ppe',
    })
    ppe: string;

    @Column('varchar', {
        nullable: true,
        name: 'safety_instruction',
    })
    safety_instruction: string;

    @Column('bit', {
        nullable: true,
        name: 'active_status',
    })
    active_status: boolean;

    @Column('datetime', {
        nullable: true,
        name: 'date_of_creation',
    })
    date_of_creation: Date;

    @Column('int', {
        nullable: true,
        name: 'created_by',
    })
    created_by: number;

    @Column('datetime', {
        nullable: true,
        name: 'date_of_modification',
    })
    date_of_modification: Date;

    @Column('int', {
        nullable: true,
        name: 'modified_by',
    })
    modified_by: number;
}
