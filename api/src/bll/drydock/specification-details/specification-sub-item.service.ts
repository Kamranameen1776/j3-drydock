import { SpecificationDetailsSubItemEntity } from '../../../entity/drydock/SpecificationDetailsSubItemEntity';

export class SpecificationSubItemService {
    public mapQueryResult(entities: SpecificationDetailsSubItemEntity[]): SpecificationDetailsSubItemEntity[] {
        return entities.map((entity) => {
            return {
                ...entity,
                discount: (entity.discount || 0) * 100,
            } as SpecificationDetailsSubItemEntity;
        });
    }
}
