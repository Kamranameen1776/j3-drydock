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
    public mapQueryResult(subItems: FindManyRecord[], hideTotal = false): Record[] {
        const records: Record[] = this.formatSubItems(subItems);

        if (!hideTotal) {
            const totalRow = this.calculateTotalRow(subItems);
            if (totalRow != null) {
                records.push(totalRow);
            }
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
                    specificationUid: curr.uid,
                    estimatedCost: new Decimal(curr.subItemCost || 0).toFixed(2),
                    utilizedCost: new Decimal(curr.subItemUtilized || 0).toFixed(2),
                    variance: this.mapCostUpdateVariance(variance),
                    rowCssClass: 'child-row',
                };

                if (!specification.children) {
                    specification.children = [];
                }

                specification.data.variance = this.mapCostUpdateVariance(
                    variance.add(specification.data.variance.value),
                );

                specification.children.push({
                    data: subItem,
                });
            } else {
                const variance = new Decimal(curr.subItemCost || 0).sub(curr.subItemUtilized || 0);
                const item: SpecificationCostUpdate = {
                    specificationUid: curr.uid,
                    subject: curr.subject,
                    code: curr.code,
                    status: curr.status,
                    estimatedCost: new Decimal(curr.estimatedCost || 0).toFixed(2),
                    utilizedCost: new Decimal(curr.utilizedCost || 0).toFixed(2),
                    variance: this.mapCostUpdateVariance(variance),
                    rowCssClass: 'no-actions',
                };
                const subItem: SpecificationSubItemCostUpdate = {
                    specificationUid: curr.uid,
                    subItemUid: curr.subItemUid,
                    subItemSubject: curr.subItemSubject,
                    estimatedCost: new Decimal(curr.subItemCost || 0).toFixed(2),
                    utilizedCost: new Decimal(curr.subItemUtilized || 0).toFixed(2),
                    variance: this.mapCostUpdateVariance(variance),
                    rowCssClass: 'child-row',
                };

                acc.push({ data: item, children: [{ data: subItem }] });
            }

            return acc;
        }, [] as FoldableGridData<SpecificationCostUpdateDto>[]);

        const varianceStyle = `.variance { font-weight: bold; padding-left: unset; }`;
        const varianceClass = 'variance';

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
            variance: this.mapCostUpdateVariance(totalVariance, varianceStyle, varianceClass),
            utilizedCost: {
                cellStyle: '',
                value: totalUtilized.toFixed(2),
            },
            hideActions: true,
            rowCssClass: 'total-row',
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

    private mapCostUpdateVariance(variance: Decimal, extraStyle?: string, extraClass?: string): HtmlCell {
        const color = variance.gt(0) ? 'green' : 'red';
        let varianceClass = !variance.eq(0) ? (variance.gt(0) ? 'greenValue' : 'redValue') : '';
        const style = !variance.eq(0)
            ? `<style>.${varianceClass} { color: ${color} } ${extraStyle ? extraStyle : ''}</style>`
            : '';
        if (extraClass) {
            varianceClass += ` ${extraClass}`;
        }
        const html = `<span class="${varianceClass}">${variance.toFixed(2)}</span>${style}`;
        return {
            innerHTML: html,
            cellStyle: '',
            value: variance.toFixed(2),
        };
    }
}
