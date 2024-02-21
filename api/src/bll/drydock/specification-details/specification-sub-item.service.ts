import { FindManyRecord } from '../../../dal/drydock/specification-details/sub-items/SpecificationDetailsSubItemsRepository';

export interface SpecificationSubItem {
    uid?: string;
    subject?: string;
    unitUid?: string;
    quantity?: number;
    unitPrice?: string;
    cost: string | object;
    discount?: number | object;
    description?: string;
}

export class SpecificationSubItemService {
    public mapQueryResult(entities: FindManyRecord[]): SpecificationSubItem[] {
        const data: SpecificationSubItem[] = entities.map((entity) => {
            return {
                ...entity,
                discount: (+entity.discount || 0) * 100,
            };
        });
        if (entities.length > 0) {
            const totalCost = data.reduce((acc, curr) => acc + (+curr.cost || 0), 0);
            const totalRow = {
                discount: {
                    innerHTML: `<span class="totalCost">Total cost</span><style>.totalCost { font-weight: bold }</style>`,
                    cellStyle: '',
                },
                cost: {
                    innerHTML: `<span class="totalCost">${totalCost}</span><style>.totalCost { font-weight: bold }</style>`,
                    cellStyle: '',
                },
                hideActions: true,
                rowCssClass: 'no-actions',
            };

            data.push(totalRow);
        }

        return data;
    }
}
