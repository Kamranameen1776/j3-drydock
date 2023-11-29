import { validateAgainstModel } from '../../../../common/drydock/ts-helpers/validate-against-model';
import { DeleteOneParams } from '../../../../dal/drydock/specification-details/sub-items/dto/DeleteOneParams';
import { SpecificationDetailsSubItemsRepository } from '../../../../dal/drydock/specification-details/sub-items/SpecificationDetailsSubItemsRepository';
import { Command } from '../../core/cqrs/Command';
import { UnitOfWork } from '../../core/uof/UnitOfWork';

export class DeleteSubItemCommand extends Command<DeleteOneParams, void> {
    protected readonly subItemsRepo = new SpecificationDetailsSubItemsRepository();
    protected readonly uow = new UnitOfWork();

    private params: DeleteOneParams;

    protected async ValidationHandlerAsync(request: DeleteOneParams): Promise<void> {
        this.params = await validateAgainstModel(DeleteOneParams, request);
    }

    public async MainHandlerAsync(): Promise<void> {
        await this.uow.ExecuteAsync(async (queryRunner) => {
            await this.subItemsRepo.deleteOneExistingByUid(this.params, queryRunner);
        });
    }
}
