import { Column, Entity } from 'typeorm';

@Entity('j2_fields_history', { schema: 'dbo' })
export class J2FieldsHistoryEntity {
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
    fieldKey: string | null;

    @Column('varchar', {
        nullable: true,
        length: 50,
        name: 'key_1',
    })
    key1: string | null;

    @Column('varchar', {
        nullable: true,
        length: 50,
        name: 'key_2',
    })
    key2: string | null;

    @Column('varchar', {
        nullable: true,
        length: 50,
        name: 'key_3',
    })
    key3: string | null;

    @Column('varchar', {
        nullable: true,
        length: 50,
        name: 'module_code',
    })
    moduleCode: string | null;

    @Column('varchar', {
        nullable: true,
        length: 50,
        name: 'function_code',
    })
    functionCode: string | null;

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
    isCurrent: boolean | null;

    @Column('varchar', {
        nullable: true,
        length: 50,
        name: 'created_by',
    })
    createdBy: string | null;

    @Column('datetime', {
        nullable: true,
        name: 'created_date',
    })
    createdDate: Date | null;

    @Column('varchar', {
        nullable: true,
        length: 50,
        name: 'modified_by',
    })
    modifiedBy: string | null;

    @Column('datetime', {
        nullable: true,
        name: 'modified_date',
    })
    modifiedDate: Date | null;

    @Column('tinyint', {
        nullable: true,
        name: 'version_number',
    })
    versionNumber: number | null;

    @Column('varchar', {
        nullable: true,
        length: 200,
        name: 'table_name',
    })
    tableName: string | null;

    @Column('varchar', {
        nullable: true,
        length: 200,
        name: 'column_name',
    })
    columnName: string | null;

    @Column('uniqueidentifier', {
        nullable: true,
        name: 'event_uid',
    })
    eventUid: string | null;

    @Column('varchar', {
        nullable: true,
        length: 100,
        name: 'display_text',
    })
    displayText: string | null;

    @Column('varchar', {
        nullable: true,
        length: 30,
        name: 'action_name',
    })
    actionName: string | null;

    @Column('varchar', {
        nullable: true,
        length: 200,
        name: 'section',
    })
    section: string | null;
}
