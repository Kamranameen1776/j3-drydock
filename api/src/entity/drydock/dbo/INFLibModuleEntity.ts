/* eslint-disable @typescript-eslint/naming-convention */
import { Column, Entity, Index } from 'typeorm';

@Entity('INF_Lib_Module', { schema: 'dbo' })
@Index('UQ__INF_Lib___4BE7616EE11B13E9', ['Module_Code'], { unique: true })
export class INF_Lib_Module {
    @Column('int', {
        nullable: false,
        name: 'ModuleId',
    })
    ModuleId: number;

    @Column('uniqueidentifier', {
        nullable: false,
        primary: true,
        default: '(newid())',
        name: 'Module_UID',
    })
    Module_UID: string;

    @Column('varchar', {
        nullable: true,
        unique: true,
        length: 50,
        name: 'Module_Code',
    })
    Module_Code: string | null;

    @Column('varchar', {
        nullable: false,
        length: 100,
        name: 'Module_Name',
    })
    Module_Name: string;

    @Column('int', {
        nullable: false,
        name: 'Created_By',
    })
    Created_By: number;

    @Column('datetime', {
        nullable: true,
        default: '(getdate())',
        name: 'Date_Of_Creation',
    })
    Date_Of_Creation: Date | null;

    @Column('int', {
        nullable: true,
        name: 'Modified_By',
    })
    Modified_By: number | null;

    @Column('datetime', {
        nullable: true,
        name: 'Date_Of_Modification',
    })
    Date_Of_Modification: Date | null;

    @Column('bit', {
        nullable: true,
        default: '((1))',
        name: 'Active_Status',
    })
    Active_Status: boolean | null;

    @Column('varchar', {
        nullable: true,
        length: 50,
        name: 'parent_module_code',
    })
    parent_module_code: string | null;

    @Column('varchar', {
        nullable: true,
        length: 500,
        name: 'base_url',
    })
    base_url: string | null;

    @Column('varchar', {
        nullable: true,
        length: 200,
        name: 'email_settings',
    })
    email_settings: string | null;

    @Column('varchar', {
        nullable: true,
        length: 30,
        name: 'api_name',
    })
    api_name: string | null;
}
