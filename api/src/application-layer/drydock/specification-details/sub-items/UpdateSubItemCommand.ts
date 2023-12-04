import { validateAgainstModel } from '../../../../common/drydock/ts-helpers/validate-against-model';
import { UpdateOneParams } from '../../../../dal/drydock/specification-details/sub-items/dto/UpdateOneParams';
import { SpecificationDetailsSubItemsRepository } from '../../../../dal/drydock/specification-details/sub-items/SpecificationDetailsSubItemsRepository';
import { type SpecificationDetailsSubItemEntity } from '../../../../entity/drydock/SpecificationDetailsSubItemEntity';
import { Command } from '../../core/cqrs/Command';
import { UnitOfWork } from '../../core/uof/UnitOfWork';

export class UpdateSubItemCommand extends Command<UpdateOneParams, SpecificationDetailsSubItemEntity> {
    protected readonly subItemRepo = new SpecificationDetailsSubItemsRepository();
    protected readonly uow = new UnitOfWork();

    private params: UpdateOneParams;

    protected async ValidationHandlerAsync(request: UpdateOneParams): Promise<void> {
        this.params = await validateAgainstModel(UpdateOneParams, request, {
            validate: {
                whitelist: true,
            },
        });
    }

    protected async MainHandlerAsync(): Promise<SpecificationDetailsSubItemEntity> {
        return this.uow.ExecuteAsync(async (queryRunner) => {
            return this.subItemRepo.updateOneExistingByUid(this.params, queryRunner);
        });
    }
}
