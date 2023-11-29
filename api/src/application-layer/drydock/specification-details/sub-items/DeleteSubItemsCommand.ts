import { type EntityExistenceMap } from '../../../../common/drydock/ts-helpers/calculate-entity-existence-map';
import { validateAgainstModel } from '../../../../common/drydock/ts-helpers/validate-against-model';
import { DeleteManyParams } from '../../../../dal/drydock/specification-details/sub-items/dto/DeleteManyParams';
import { SpecificationDetailsSubItemsRepository } from '../../../../dal/drydock/specification-details/sub-items/SpecificationDetailsSubItemsRepository';
import { Command } from '../../core/cqrs/Command';
import { UnitOfWork } from '../../core/uof/UnitOfWork';

export class DeleteSubItemsCommand extends Command<DeleteManyParams, EntityExistenceMap> {
    protected readonly subItemsRepo = new SpecificationDetailsSubItemsRepository();
    protected readonly uow = new UnitOfWork();

    private params: DeleteManyParams;

    protected async ValidationHandlerAsync(request: DeleteManyParams): Promise<void> {
        this.params = await validateAgainstModel(DeleteManyParams, request);
    }

    protected async MainHandlerAsync(): Promise<EntityExistenceMap> {
        return this.uow.ExecuteAsync(async (queryRunner) => {
            return this.subItemsRepo.deleteManyByUids(this.params, queryRunner);
        });
    }
}
