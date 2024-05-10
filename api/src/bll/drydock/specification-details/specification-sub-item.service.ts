import { Decimal } from 'decimal.js';
import _, { Dictionary } from 'lodash';

import { MergeOverride } from '../../../common/drydock/ts-helpers/merge-override';
import {
    SpecificationCostUpdate,
    SpecificationCostUpdateDto,
    SpecificationCostUpdateQueryResult,
    SpecificationSubItemCostUpdate,
} from '../../../dal/drydock/specification-details/dtos/ISpecificationCostUpdateDto';
import { FindManyRecord } from '../../../dal/drydock/specification-details/sub-items/SpecificationDetailsSubItemsRepository';
import { DisabledSpecificationStatuses } from '../../../shared/constants/specifications';
import { TaskManagerStatus } from '../../../shared/enum/task-manager-status.enum';
import { ODataResult } from '../../../shared/interfaces';
import { HtmlCell } from '../../../shared/interfaces';
import { FoldableGridData } from '../../../shared/interfaces/foldable-grid-data.interface';

interface TotalRow {
    readonly discount: HtmlCell;
    readonly cost: HtmlCell;
    readonly hideActions: boolean;
    readonly rowCssClass: string;
    readonly utilized?: HtmlCell;
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
        const grid: FoldableGridData<SpecificationCostUpdateDto>[] = [];

        let totalEstimated: Decimal = new Decimal(0);
        let totalCost: Decimal = new Decimal(0);
        let totalUtilized: Decimal = new Decimal(0);

        const groupedBySpecification: Dictionary<SpecificationCostUpdateQueryResult[]> = _.groupBy(
            data.records,
            (record) => record.uid,
        );

        for (const specificationKey in groupedBySpecification) {
            const subItems = groupedBySpecification[specificationKey];

            let specificationEstimatedCost: Decimal = new Decimal(0);
            let specificationUtilizedCost: Decimal = new Decimal(0);
            let specificationTotalCost: Decimal = new Decimal(0);

            const rowSubItems: FoldableGridData<SpecificationCostUpdateDto>[] = [];

            for (const subItem of subItems) {
                const estimatedCost = new Decimal(subItem.estimatedCost ?? 0);
                const subItemUtilized = new Decimal(subItem.subItemUtilized ?? 0);
                const subItemCost = new Decimal(subItem.subItemCost ?? 0);

                totalEstimated = totalEstimated.add(estimatedCost);
                totalUtilized = totalUtilized.add(subItemUtilized);
                totalCost = totalCost.add(subItemCost);

                specificationEstimatedCost = specificationEstimatedCost.add(estimatedCost);
                specificationUtilizedCost = specificationUtilizedCost.add(subItemUtilized);
                specificationTotalCost = specificationTotalCost.add(subItemCost);

                const variance: Decimal = subItemCost.sub(subItemUtilized);

                const rowSubItem: SpecificationSubItemCostUpdate = {
                    specificationUid: specificationKey,
                    subItemUid: subItem.subItemUid,
                    subItemSubject: subItem.subItemSubject,
                    estimatedCost: new Decimal(estimatedCost).toFixed(2),
                    utilizedCost: new Decimal(subItemUtilized).toFixed(2),
                    variance: this.mapCostUpdateVariance(variance),
                    rowCssClass: 'child-row',
                    editable: this.canEditSubItem(subItem.statusId),
                };

                rowSubItems.push({ data: rowSubItem });
            }

            const specificationVariance: Decimal = specificationTotalCost.sub(specificationUtilizedCost);

            const rowSpecification: SpecificationCostUpdate = {
                specificationUid: specificationKey,
                subject: subItems[0].subject,
                code: subItems[0].code,
                status: subItems[0].status,
                estimatedCost: specificationEstimatedCost.toFixed(2),
                utilizedCost: specificationUtilizedCost.toFixed(2),
                variance: this.mapCostUpdateVariance(specificationVariance),
                rowCssClass: 'no-actions',
            };

            grid.push({ data: rowSpecification, children: rowSubItems });
        }

        const totalVariance: Decimal = totalCost.sub(totalUtilized);

        const varianceStyle = `.variance { font-weight: bold; padding-left: unset; }`;
        const varianceClass = 'variance';

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

        grid.push({ data: totalRow });

        return {
            ...data,
            records: grid,
        };
    }

    protected formatSubItems(subItems: FindManyRecord[]): RecordFormatted[] {
        const subItemsFormatted: RecordFormatted[] = [];

        for (const subItem of subItems) {
            const subItemFormatted: RecordFormatted = {
                ...subItem,
                discount: new Decimal(subItem.discount || 0).times(100).toNumber(),
                cost: new Decimal(subItem.cost || 0).toFixed(2),
                utilized: new Decimal(subItem.utilized || 0).toFixed(2),
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

    private canEditSubItem(specificationStatusId: TaskManagerStatus): boolean {
        return !DisabledSpecificationStatuses.includes(specificationStatusId);
    }
}
