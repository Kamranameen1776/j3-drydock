import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

import { SpecificationDetailsSubItemEntity } from './SpecificationDetailsSubItemEntity';

@Entity('lib_unit_type', { schema: 'dbo' })
export class UnitTypeEntity {
    @PrimaryGeneratedColumn('uuid')
    uid: string;

    @Column({
        name: '_id',
        type: 'varchar',
        length: 100,
        nullable: true,
    })
    readonly id: string;

    @Column({
        name: 'types',
        type: 'varchar',
        length: 50,
        nullable: true,
    })
    readonly types: string;

    @Column({
        name: 'active_status',
        type: 'bit',
        nullable: true,
    })
    readonly activeStatus: boolean;

    @Column({
        name: 'created_by',
        type: 'int',
        nullable: true,
    })
    readonly createdBy: number;

    @CreateDateColumn({
        name: 'date_of_creation',
        type: 'datetime',
        nullable: true,
    })
    readonly dateOfCreation: Date;

    @Column({
        name: 'modified_by',
        type: 'int',
        nullable: true,
    })
    readonly modifiedBy: number;

    @UpdateDateColumn({
        name: 'date_of_modification',
        type: 'datetime',
        nullable: true,
    })
    readonly dateOfModification: Date;

    @Column({
        name: 'deleted_by',
        type: 'int',
        nullable: true,
    })
    readonly deletedBy: number;

    @DeleteDateColumn({
        name: 'date_of_deletion',
        type: 'datetime',
        nullable: true,
    })
    readonly dateOfDeletion: Date;

    // Relations

    @OneToOne(() => SpecificationDetailsSubItemEntity, (subItem) => subItem.unitType)
    readonly specificationDetailsSubItem: SpecificationDetailsSubItemEntity;
}
