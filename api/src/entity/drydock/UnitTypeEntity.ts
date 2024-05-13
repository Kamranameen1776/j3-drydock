import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { SpecificationDetailsSubItemEntity } from './SpecificationDetailsSubItemEntity';

@Entity('lib_unit_type', { schema: 'dbo' })
export class UnitTypeEntity {
    @PrimaryGeneratedColumn('uuid')
    uid: string;

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

    // Relations

    @OneToOne(() => SpecificationDetailsSubItemEntity, (subItem) => subItem.unitType)
    readonly specificationDetailsSubItem: SpecificationDetailsSubItemEntity;
}
