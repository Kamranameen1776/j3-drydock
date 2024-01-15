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
    // FIXME: (create-sub-item) 1.1.2.1.2.1 gather cost factors
    // FIXME: (update-sub-item) 1.1.2.4.2.1 gather cost factors
    const quantity = new Decimal(subItem.quantity || 0);
    const unitPrice = new Decimal(subItem.unitPrice || 0);
    const discount = new Decimal(subItem.discount || 0);
    const discountQuotient = new Decimal(1).minus(discount);

    // FIXME: (create-sub-item) 1.1.2.1.2.2 calculate cost
    // FIXME: (update-sub-item) 1.1.2.4.2.2 calculate cost
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
        type: 'varchar',
        length: 5000,
        nullable: true,
    })
    description?: string;

    // FIXME: (create-sub-item) 1.1.2.2.1 define quantity as int / number
    // FIXME: (update-sub-item) 1.1.2.3.1 define quantity as int / number
    @Column({
        name: 'quantity',
        type: 'int',
        nullable: true,
    })
    quantity?: number | null;

    // FIXME: (create-sub-item) 1.1.2.2.2 define unit_price as decimal(10, 2) / string
    // FIXME: (update-sub-item) 1.1.2.3.2 define unit_price as decimal(10, 2) / string
    @Column({
        name: 'unit_price',
        type: 'decimal',
        precision: 10,
        scale: 2,
        nullable: true,
    })
    unitPrice?: string | null;

    // FIXME: (create-sub-item) 1.1.2.2.3 define discount as decimal(5, 4) / string
    // FIXME: (update-sub-item) 1.1.2.3.3 define discount as decimal(5, 4) / string
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

    // FIXME: (create-sub-item) 1.1.2.2.4 define cost as decimal(10, 4) / string
    // FIXME: (update-sub-item) 1.1.2.3.4 define cost as decimal(10, 4) / string
    @Column({
        name: 'cost',
        type: 'decimal',
        precision: 10,
        scale: 4,
        nullable: true,
    })
    cost: string | null;
}
