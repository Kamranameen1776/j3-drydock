import { Decimal } from 'decimal.js';
import { Column, Entity, Index, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, RelationId } from 'typeorm';

import { BaseDatesEntity } from '../baseDatesEntity';
import { SpecificationDetailsEntity } from './SpecificationDetailsEntity';
import { UnitTypeEntity } from './UnitTypeEntity';

export const SUBJECT_MAX_LENGTH = 500;
export const DISCOUNT_MIN = 0;
export const DISCOUNT_MAX = 1;
export const DISCOUNT_DEFAULT = DISCOUNT_MIN;

/** Depends on {@link SUBJECT_MAX_LENGTH} */
const SUBJECT_COLUMN_LENGTH = 512; // next power of 2

export const costFactorsKeys = ['quantity', 'unitPrice', 'discount'] satisfies Array<
    keyof SpecificationDetailsSubItemEntity
>;

export type SubItemCostFactorsExcerpt = Pick<SpecificationDetailsSubItemEntity, (typeof costFactorsKeys)[number]>;

export function calculateCost(subItem: SubItemCostFactorsExcerpt): Decimal {
    const quantity = new Decimal(subItem.quantity || 0);
    const unitPrice = new Decimal(subItem.unitPrice || 0);
    const discount = new Decimal(subItem.discount || 0);
    const discountQuotient = new Decimal(1).minus(discount);

    // quantity * unitPrice * (1 - discount)
    return quantity.times(unitPrice).times(discountQuotient);
}

@Entity('specification_details_sub_item', { schema: 'dry_dock' })
@Index('idx_specification_details_sub_item_subject', ['subject'])
export class SpecificationDetailsSubItemEntity extends BaseDatesEntity {
    @PrimaryGeneratedColumn('uuid')
    uid: string;

    @Column({
        name: 'number',
        type: 'int',
        nullable: false,
        generated: 'increment',
        update: false,
    })
    number: number;

    @Column({
        name: 'subject',
        type: 'varchar',
        length: SUBJECT_COLUMN_LENGTH,
        nullable: false,
    })
    subject: string;

    @Column({
        name: 'description',
        type: 'nvarchar',
        length: 'max',
        nullable: true,
    })
    description?: string;

    @Column({
        name: 'quantity',
        type: 'int',
        nullable: true,
    })
    quantity?: number | null;

    @Column({
        name: 'unit_price',
        type: 'decimal',
        precision: 10,
        scale: 2,
        nullable: true,
    })
    unitPrice?: string | null;

    @Column({
        name: 'discount',
        type: 'decimal',
        precision: 5,
        scale: 4,
        nullable: true,
        default: () => `(${DISCOUNT_DEFAULT})`,
    })
    discount: string;

    @ManyToOne(() => SpecificationDetailsEntity, (specificationDetails) => specificationDetails.SubItems)
    @JoinColumn({
        name: 'specification_details_uid',
        referencedColumnName: 'uid',
    })
    specificationDetails: SpecificationDetailsEntity;

    // Relations
    @RelationId<SpecificationDetailsSubItemEntity>((subItem) => subItem.specificationDetails)
    specificationDetailsUid: string;

    @OneToOne(() => UnitTypeEntity, (unitType) => unitType.specificationDetailsSubItem)
    @JoinColumn({
        name: 'unit_type_uid',
        referencedColumnName: 'uid',
    })
    unitType: UnitTypeEntity;

    @RelationId<SpecificationDetailsSubItemEntity>((subItem) => subItem.unitType)
    unitTypeUid: string;

    @Column({
        name: 'cost',
        type: 'decimal',
        precision: 10,
        scale: 4,
        nullable: true,
    })
    cost: string | null;

    @Column({
        name: 'yard_comments',
        type: 'varchar',
        length: 2048,
        nullable: true,
    })
    yardComments: string;

    @Column({
        name: 'utilized',
        type: 'decimal',
        precision: 10,
        scale: 4,
    })
    utilized: number;
}
