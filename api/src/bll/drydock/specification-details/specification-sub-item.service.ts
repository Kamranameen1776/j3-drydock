import { Decimal } from 'decimal.js';

import { type MergeOverride } from '../../../common/drydock/ts-helpers/merge-override';
import { SpecificationDetailsSubItemEntity } from '../../../entity/drydock/SpecificationDetailsSubItemEntity';
import { type HtmlCell } from '../../../shared/interfaces';

/** @private */
interface TotalRow {
    readonly discount: HtmlCell;
    readonly cost: HtmlCell;
    readonly hideActions: boolean;
    readonly rowCssClass: string;
}

/** @private */
type WithDiscountFormatted<Value extends object> = MergeOverride<
    Value,
    {
        readonly discount: number;
    }
>;

/** @private */
type SubItemFormatted = WithDiscountFormatted<SpecificationDetailsSubItemEntity>;

export type Record = SubItemFormatted | TotalRow;

export class SpecificationSubItemService {
    protected formatSubItems(subItems: SpecificationDetailsSubItemEntity[]): SubItemFormatted[] {
        const subItemsFormatted: SubItemFormatted[] = [];

        // FIXME: mutates values in the original array
        for (const subItem of subItems) {
            const discountFormatted = subItem.discount?.times(100).toNumber() ?? 0;
            const subItemFormatted: SubItemFormatted = Object.assign(subItem, { discount: discountFormatted });

            subItemsFormatted.push(subItemFormatted);
        }

        return subItemsFormatted;
    }

    protected calculateTotalRow(subItems: SpecificationDetailsSubItemEntity[]): TotalRow | null {
        if (subItems.length === 0) {
            return null;
        }

        const totalCost = subItems.reduce((sum, subItem) => sum.plus(subItem.getCost()), new Decimal(0));
        const totalCostText = totalCost.toPrecision(2);

        return {
            discount: {
                innerHTML: `<span class="totalCost">Total cost</span><style>.totalCost { font-weight: bold }</style>`,
                cellStyle: '',
                value: '',
            },
            cost: {
                innerHTML: `<span class="totalCost">${totalCostText}</span><style>.totalCost { font-weight: bold }</style>`,
                cellStyle: '',
                value: '',
            },
            hideActions: true,
            rowCssClass: 'no-actions',
        };
    }

    public mapQueryResult(subItems: SpecificationDetailsSubItemEntity[]): Record[] {
        const recordsFormatted = this.formatSubItems(subItems);
        const totalRow = this.calculateTotalRow(subItems);
        const records: Record[] = recordsFormatted;

        if (totalRow != null) {
            records.push(totalRow);
        }

        return records;
    }
}
