import { Decimal } from 'decimal.js';

import { type MergeOverride } from '../../../common/drydock/ts-helpers/merge-override';
import { type FindManyRecord } from '../../../dal/drydock/specification-details/sub-items/SpecificationDetailsSubItemsRepository';
import { type HtmlCell } from '../../../shared/interfaces';

interface TotalRow {
    readonly discount: HtmlCell;
    readonly cost: HtmlCell;
    readonly hideActions: boolean;
    readonly rowCssClass: string;
}

type WithDiscountFormatted<Value extends object> = MergeOverride<
    Value,
    {
        readonly discount: number;
    }
>;

type RecordFormatted = WithDiscountFormatted<FindManyRecord>;

export type Record = RecordFormatted | TotalRow;

export class SpecificationSubItemService {
    protected formatSubItems(subItems: FindManyRecord[]): RecordFormatted[] {
        const subItemsFormatted: RecordFormatted[] = [];

        for (const subItem of subItems) {
            const discountFormatted = new Decimal(subItem.discount || 0).times(100).toNumber();
            const subItemFormatted: RecordFormatted = Object.assign(subItem, { discount: discountFormatted });

            subItemsFormatted.push(subItemFormatted);
        }

        return subItemsFormatted;
    }

    protected calculateTotalRow(subItems: FindManyRecord[]): TotalRow | null {
        if (subItems.length === 0) {
            return null;
        }

        const totalCost = subItems.reduce((sum, subItem) => sum.plus(subItem.cost || 0), new Decimal(0));
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

    public mapQueryResult(subItems: FindManyRecord[]): Record[] {
        const recordsFormatted = this.formatSubItems(subItems);
        const totalRow = this.calculateTotalRow(subItems);
        const records: Record[] = recordsFormatted;

        if (totalRow != null) {
            records.push(totalRow);
        }

        return records;
    }
}
