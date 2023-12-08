import { Query } from '../../application-layer/drydock/core/cqrs/Query';
import { UnitOfWork } from '../../application-layer/drydock/core/uof/UnitOfWork';
import { SpecificationDetailsSubItemsRepository } from '../../dal/drydock/specification-details/sub-items/SpecificationDetailsSubItemsRepository';

export class TestQuery extends Query<void, unknown> {
    protected readonly repo = new SpecificationDetailsSubItemsRepository();
    protected readonly uow = new UnitOfWork();

    protected MainHandlerAsync(): Promise<unknown> {
        return this.uow.ExecuteAsync(async (queryRunner) => {
            return this.repo.test(queryRunner);
        });
    }
}
