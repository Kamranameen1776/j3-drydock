import { Column, Entity } from 'typeorm';

@Entity('j2_fields_history', { schema: 'dbo' })
export class J2FieldsHistory {
    @Column('uniqueidentifier', {
        nullable: false,
        primary: true,
        default: '(newid())',
        name: 'uid',
    })
    uid: string;

    @Column('varchar', {
        nullable: true,
        length: 250,
        name: 'field_key',
    })
    field_key: string | null;

    @Column('varchar', {
        nullable: true,
        length: 50,
        name: 'key_1',
    })
    key_1: string | null;

    @Column('varchar', {
        nullable: true,
        length: 50,
        name: 'key_2',
    })
    key_2: string | null;

    @Column('varchar', {
        nullable: true,
        length: 50,
        name: 'key_3',
    })
    key_3: string | null;

    @Column('varchar', {
        nullable: true,
        length: 50,
        name: 'module_code',
    })
    module_code: string | null;

    @Column('varchar', {
        nullable: true,
        length: 50,
        name: 'function_code',
    })
    function_code: string | null;

    @Column('varchar', {
        nullable: true,
        length: 8000,
        name: 'value',
    })
    value: string | null;

    @Column('bit', {
        nullable: true,
        name: 'is_current',
    })
    is_current: boolean | null;

    @Column('varchar', {
        nullable: true,
        length: 50,
        name: 'created_by',
    })
    created_by: string | null;

    @Column('datetime', {
        nullable: true,
        name: 'created_date',
    })
    created_date: Date | null;

    @Column('varchar', {
        nullable: true,
        length: 50,
        name: 'modified_by',
    })
    modified_by: string | null;

    @Column('datetime', {
        nullable: true,
        name: 'modified_date',
    })
    modified_date: Date | null;

    @Column('tinyint', {
        nullable: true,
        name: 'version_number',
    })
    version_number: number | null;

    @Column('varchar', {
        nullable: true,
        length: 200,
        name: 'table_name',
    })
    table_name: string | null;

    @Column('varchar', {
        nullable: true,
        length: 200,
        name: 'column_name',
    })
    column_name: string | null;

    @Column('uniqueidentifier', {
        nullable: true,
        name: 'event_uid',
    })
    event_uid: string | null;

    @Column('varchar', {
        nullable: true,
        length: 100,
        name: 'display_text',
    })
    display_text: string | null;

    @Column('varchar', {
        nullable: true,
        length: 30,
        name: 'action_name',
    })
    action_name: string | null;

    @Column('varchar', {
        nullable: true,
        length: 200,
        name: 'section',
    })
    section: string | null;
}
