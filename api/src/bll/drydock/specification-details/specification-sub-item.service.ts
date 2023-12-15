import { SpecificationDetailsSubItemEntity } from '../../../entity/drydock/SpecificationDetailsSubItemEntity';

export class SpecificationSubItemService {
    public mapQueryResult(entities: SpecificationDetailsSubItemEntity[]): SpecificationDetailsSubItemEntity[] {
        const data = entities.map((entity) => {
            return {
                ...entity,
                discount: (entity.discount || 0) * 100,
            } as SpecificationDetailsSubItemEntity;
        });

        const totalCost = data.reduce((acc, curr) => acc + (curr.cost || 0), 0);
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
        } as any;

        data.push(totalRow);

        return data;
    }
}
