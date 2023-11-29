import { validateAgainstModel } from '../../../../common/drydock/ts-helpers/validate-against-model';
import { CreateOneParams } from '../../../../dal/drydock/specification-details/sub-items/dto/CreateOneParams';
import { SpecificationDetailsSubItemsRepository } from '../../../../dal/drydock/specification-details/sub-items/SpecificationDetailsSubItemsRepository';
import { SpecificationDetailsSubItemEntity } from '../../../../entity/drydock/SpecificationDetailsSubItemEntity';
import { Command } from '../../core/cqrs/Command';
import { UnitOfWork } from '../../core/uof/UnitOfWork';

export class CreateSubItemCommand extends Command<CreateOneParams, SpecificationDetailsSubItemEntity> {
    protected readonly subItemRepo = new SpecificationDetailsSubItemsRepository();
    protected readonly uow = new UnitOfWork();

    private params: CreateOneParams;

    protected async ValidationHandlerAsync(request: CreateOneParams): Promise<void> {
        this.params = await validateAgainstModel(CreateOneParams, request, {
            validate: {
                whitelist: true,
            },
        });
    }

    protected async MainHandlerAsync(): Promise<SpecificationDetailsSubItemEntity> {
        return this.uow.ExecuteAsync(async (queryRunner) => {
            return this.subItemRepo.createOne(this.params, queryRunner);
        });
    }
}
