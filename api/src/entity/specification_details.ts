import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('specification_details', { schema: 'dry_dock' })
export class SpecificationDetailsEntity {
    @PrimaryGeneratedColumn('uuid')
    uid: string;

    @Column('uniqueidentifier', {
        nullable: true,
        name: 'tm_task',
    })
    tm_task: string;

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
        name: 'item_source_uid',
    })
    item_source_uid: string;

    @Column('varchar', {
        nullable: true,
        name: 'item_number',
        length: 200,
    })
    item_number: string;

    @Column('uniqueidentifier', {
        nullable: true,
        name: 'done_by_uid',
    })
    done_by_uid: string;

    @Column('uniqueidentifier', {
        nullable: true,
        name: 'item_category_uid',
    })
    item_category_uid: string;

    @Column('uniqueidentifier', {
        nullable: true,
        name: 'inspection_uid',
    })
    inspection_uid: string;

    @Column('varchar', {
        nullable: true,
        name: 'equipment_description',
        length: 200,
    })
    equipment_description: string;

    @Column('uniqueidentifier', {
        nullable: true,
        name: 'priority_uid',
    })
    priority_uid: string;

    @Column('varchar', {
        nullable: true,
        name: 'description',
        length: 1000,
    })
    description: string;

    @Column('datetime', {
        nullable: true,
        name: 'start_date',
    })
    start_date: Date;

    @Column('int', {
        nullable: true,
        name: 'estimated_days',
    })
    estimated_days: number;

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

    @Column('uniqueidentifier', {
        nullable: true,
        name: 'onboard_location_uid',
    })
    onboard_location_uid: string;

    @Column('varchar', {
        nullable: true,
        name: 'access',
        length: 200,
    })
    access: string;

    @Column('uniqueidentifier', {
        nullable: true,
        name: 'material_supplied_by_uid',
    })
    material_supplied_by_uid: string;

    @Column('varchar', {
        nullable: true,
        name: 'test_criteria',
        length: 200,
    })
    test_criteria: string;

    @Column('varchar', {
        nullable: true,
        name: 'ppe',
        length: 1000,
    })
    ppe: string;

    @Column('varchar', {
        nullable: true,
        name: 'safety_instruction',
        length: 1000,
    })
    safety_instruction: string;

    @Column('bit', {
        nullable: true,
        name: 'active_status',
    })
    active_status: boolean;

    @Column('uniqueidentifier', {
        nullable: true,
        name: 'created_by',
    })
    created_by_uid: string;

    @Column('datetime', {
        nullable: true,
        name: 'created_at',
    })
    created_at: Date;

    @Column('uniqueidentifier', {
        nullable: true,
        name: 'updated_by',
    })
    updated_by_uid: string;

    @Column('datetime', {
        nullable: true,
        name: 'updated_at',
    })
    updated_at: Date;

    @Column('uniqueidentifier', {
        nullable: true,
        name: 'deleted_by',
    })
    deleted_by_uid: string;

    @Column('datetime', {
        nullable: true,
        name: 'deleted_at',
    })
    deleted_at: Date;
}
