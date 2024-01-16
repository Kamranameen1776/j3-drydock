import { Decimal } from 'decimal.js';

import { MergeOverride } from '../../../common/drydock/ts-helpers/merge-override';
import {
    SpecificationCostUpdate,
    SpecificationCostUpdateDto,
    SpecificationCostUpdateQueryResult,
    SpecificationSubItemCostUpdate,
} from '../../../dal/drydock/specification-details/dtos/ISpecificationCostUpdateDto';
import { FindManyRecord } from '../../../dal/drydock/specification-details/sub-items/SpecificationDetailsSubItemsRepository';
import { ODataResult } from '../../../shared/interfaces';
import { HtmlCell } from '../../../shared/interfaces';
import { FoldableGridData } from '../../../shared/interfaces/foldable-grid-data.interface';

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
    public mapQueryResult(subItems: FindManyRecord[]): Record[] {
        const recordsFormatted = this.formatSubItems(subItems);
        const totalRow = this.calculateTotalRow(subItems);
        const records: Record[] = recordsFormatted;

        if (totalRow != null) {
            records.push(totalRow);
        }

        return records;
    }

    public mapCostUpdateQueryResult(
        data: ODataResult<SpecificationCostUpdateQueryResult>,
    ): ODataResult<FoldableGridData<SpecificationCostUpdateDto>> {
        const records = data.records;
        const zero = new Decimal(0);

        const specifications = records.reduce((acc, curr) => {
            const specification = acc.find(({ data }) => data.specificationUid === curr.uid);

            if (specification) {
                const variance = new Decimal(curr.subItemCost || 0).sub(curr.subItemUtilized || 0);
                const subItem: SpecificationSubItemCostUpdate = {
                    subItemUid: curr.subItemUid,
                    subItemSubject: curr.subItemSubject,
                    estimatedCost: new Decimal(curr.subItemCost).toFixed(2),
                    utilizedCost: new Decimal(curr.subItemUtilized).toFixed(2),
                    variance: this.mapCostUpdateVariance(variance),
                };

                if (!specification.children) {
                    specification.children = [];
                }

                specification.data.estimatedCost = new Decimal(specification.data.estimatedCost)
                    .add(curr.subItemCost)
                    .toFixed(2);
                specification.data.utilizedCost = new Decimal(specification.data.utilizedCost || 0)
                    .add(curr.subItemUtilized)
                    .toFixed(2);
                specification.data.variance = this.mapCostUpdateVariance(
                    variance.add(specification.data.variance.value),
                );

                specification.children.push({
                    data: subItem,
                });
            } else {
                const item: SpecificationCostUpdate = {
                    specificationUid: curr.uid,
                    subject: curr.subject,
                    code: curr.code,
                    status: curr.status,
                    estimatedCost: zero.toFixed(2),
                    variance: this.mapCostUpdateVariance(zero),
                    utilizedCost: zero.toFixed(2),
                    rowCssClass: 'no-actions',
                };

                acc.push({ data: item });
            }

            return acc;
        }, [] as FoldableGridData<SpecificationCostUpdateDto>[]);

        const totalEstimated = specifications.reduce((acc, curr) => acc.add(curr.data.estimatedCost), zero);
        const totalUtilized = specifications.reduce((acc, curr) => acc.add(curr.data.utilizedCost || 0), zero);
        const totalVariance = specifications.reduce((acc, curr) => acc.add(curr.data.variance.value), zero);
        const totalRow: any = {
            status: {
                innerHTML: `<span class="totalCost">Total</span><style>.totalCost { font-weight: bold }</style>`,
                cellStyle: '',
                value: 'Total',
            },
            estimatedCost: {
                innerHTML: `<span class="totalCost">${totalEstimated.toFixed(
                    2,
                )}</span><style>.totalCost { font-weight: bold }</style>`,
                cellStyle: '',
                value: totalEstimated.toFixed(2),
            },
            variance: this.mapCostUpdateVariance(totalVariance, true),
            utilizedCost: {
                cellStyle: '',
                value: totalUtilized.toFixed(2),
            },
            hideActions: true,
            rowCssClass: 'no-actions',
        };

        specifications.push({ data: totalRow });

        return {
            ...data,
            records: specifications,
        };
    }

    protected formatSubItems(subItems: FindManyRecord[]): RecordFormatted[] {
        const subItemsFormatted: RecordFormatted[] = [];

        for (const subItem of subItems) {
            const subItemFormatted: RecordFormatted = {
                ...subItem,
                discount: new Decimal(subItem.discount || 0).times(100).toNumber(),
                // TODO: for some reason the cost returned from the database is a number, not a string, we should fix
                // that and then we can remove this "toFixed()"
                cost: new Decimal(subItem.cost || 0).toFixed(2),
            };

            subItemsFormatted.push(subItemFormatted);
        }

        return subItemsFormatted;
    }

    protected calculateTotalRow(subItems: FindManyRecord[]): TotalRow | null {
        if (subItems.length === 0) {
            return null;
        }

        const totalCost = subItems.reduce((sum, subItem) => sum.plus(subItem.cost || 0), new Decimal(0));
        const totalCostText = totalCost.toFixed(2);

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

    private mapCostUpdateVariance(variance: Decimal, addBold = false) {
        const color = variance.gt(0) ? 'green' : 'red';
        let varianceClass = !variance.eq(0) ? (variance.gt(0) ? 'greenValue' : 'redValue') : '';
        const boldStyle = `.bold { font-weight: bold }`;
        const style = !variance.eq(0)
            ? `<style>.${varianceClass} { color: ${color} } ${addBold ? boldStyle : ''}</style>`
            : '';
        if (addBold) {
            varianceClass += ' bold';
        }
        const html = `<span class="${varianceClass}">${variance.toFixed(2)}</span>${style}`;
        return {
            innerHTML: html,
            cellStyle: '',
            value: variance.toFixed(2),
        };
    }
}
