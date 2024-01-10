import { Max, Min, validate } from 'class-validator';
import {
    BeforeInsert,
    BeforeUpdate,
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
    RelationId,
} from 'typeorm';

import { Decimal, decimalTransformer } from '../../dal/drydock/utils/DecimalTransformer';
import { BaseDatesEntity } from '../baseDatesEntity';
import { SpecificationDetailsEntity } from './SpecificationDetailsEntity';
import { UnitTypeEntity } from './UnitTypeEntity';

export const SUBJECT_MAX_LENGTH = 500;
export const DISCOUNT_MIN = 0;
export const DISCOUNT_MAX = 1;
export const DISCOUNT_DEFAULT = DISCOUNT_MIN;

/** @private */
const ZERO = new Decimal(0);

/** @private */
const ONE = new Decimal(1);

/** @private Depends on {@link SUBJECT_MAX_LENGTH} */
const SUBJECT_COLUMN_LENGTH = 512; // next power of 2

export const costFactorsKeys = ['quantity', 'unitPrice', 'discount'] satisfies Array<
    keyof SpecificationDetailsSubItemEntity
>;

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
    readonly number: number;

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

    @Column({
        name: 'quantity',
        type: 'int',
        nullable: true,
        transformer: decimalTransformer,
    })
    quantity?: Decimal;

    @Column({
        name: 'unit_price',
        type: 'decimal',
        precision: 10,
        scale: 2,
        nullable: true,
        transformer: decimalTransformer,
    })
    unitPrice?: Decimal;

    @Column({
        name: 'discount',
        type: 'decimal',
        precision: 5,
        scale: 4,
        nullable: true,
        transformer: decimalTransformer,
        default: () => `(${DISCOUNT_DEFAULT})`,
    })
    @Min(DISCOUNT_MIN)
    @Max(DISCOUNT_MAX)
    discount?: Decimal;

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
    readonly unitTypeUid: string;

    /**
     * `cost` is supposed to be set only by an internal hook, never externally.
     * To read the value externally, use {@link getCost} or {@link calculateCost}.
     */
    @Column({
        name: 'cost',
        type: 'decimal',
        precision: 10,
        scale: 4,
        nullable: true,
        transformer: decimalTransformer,
    })
    protected cost: Decimal;

    // Methods and Hooks

    public getCost(): Decimal {
        return this.cost;
    }

    public calculateCost(): Decimal {
        const quantity = this.quantity ?? ZERO;
        const unitPrice = this.unitPrice ?? ZERO;
        const discount = this.discount ?? ZERO;
        const discountQuotient = ONE.minus(discount);

        // quantity * unitPrice * (1 - discount)
        return quantity.times(unitPrice).times(discountQuotient);
    }

    @BeforeInsert()
    @BeforeUpdate()
    protected updateCost(): void {
        this.cost = this.calculateCost();
    }

    @BeforeInsert()
    @BeforeUpdate()
    protected async assertValid(): Promise<void> {
        const errors = await validate(this);

        if (errors.length > 0) {
            throw errors;
        }
    }
}
