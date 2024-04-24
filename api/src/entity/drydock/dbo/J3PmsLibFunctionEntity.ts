/* eslint-disable @typescript-eslint/naming-convention */
import { Column, Entity } from 'typeorm';

@Entity('j3_pms_lib_function', { schema: 'dbo' })
export class J3PmsLibFunction {
    @Column('uniqueidentifier', {
        nullable: false,
        primary: true,
        name: 'uid',
    })
    uid: string;

    @Column('uniqueidentifier', {
        nullable: true,
        name: 'upwind_uid',
    })
    upwind_uid: string | null;

    @Column('nvarchar', {
        nullable: true,
        length: 200,
        name: 'name',
    })
    name: string | null;

    @Column('nvarchar', {
        nullable: true,
        length: 1600,
        name: 'description',
    })
    description: string | null;

    @Column('tinyint', {
        nullable: true,
        name: 'display_order',
    })
    display_order: number | null;

    @Column('int', {
        nullable: false,
        name: 'created_by',
    })
    created_by: number;

    @Column('bit', {
        nullable: true,
        default: '((1))',
        name: 'active_status',
    })
    active_status: boolean | null;

    @Column('datetime', {
        nullable: true,
        default: '(getdate())',
        name: 'date_of_creation',
    })
    date_of_creation: Date | null;

    @Column('int', {
        nullable: true,
        name: 'modified_by',
    })
    modified_by: number | null;

    @Column('datetime', {
        nullable: true,
        name: 'date_of_modification',
    })
    date_of_modification: Date | null;

    @Column('uniqueidentifier', {
        nullable: true,
        name: 'parent_function_uid',
    })
    parent_function_uid: string | null;

    @Column('int', {
        nullable: true,
        name: 'level',
    })
    level: number | null;
}
