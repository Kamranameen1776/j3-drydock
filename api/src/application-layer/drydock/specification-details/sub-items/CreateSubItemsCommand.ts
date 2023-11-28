import { validateAgainstModel } from '../../../../common/drydock/ts-helpers/validate-against-model';
import { CreateManyParams } from '../../../../dal/drydock/specification-details/sub-items/dto/CreateManyParams';
import { SpecificationDetailsSubItemsRepository } from '../../../../dal/drydock/specification-details/sub-items/SpecificationDetailsSubItemsRepository';
import { SpecificationDetailsSubItemEntity } from '../../../../entity/drydock/SpecificationDetailsSubItemEntity';
import { Command } from '../../core/cqrs/Command';
import { UnitOfWork } from '../../core/uof/UnitOfWork';

export class CreateSubItemsCommand extends Command<CreateManyParams, SpecificationDetailsSubItemEntity[]> {
    protected readonly subItemRepo = new SpecificationDetailsSubItemsRepository();
    protected readonly uow = new UnitOfWork();

    private params: CreateManyParams;

    protected async ValidationHandlerAsync(request: CreateManyParams): Promise<void> {
        this.params = await validateAgainstModel(CreateManyParams, request);
    }

    protected async MainHandlerAsync(): Promise<SpecificationDetailsSubItemEntity[]> {
        return this.uow.ExecuteAsync(async (queryRunner) => {
            return this.subItemRepo.createMany(this.params, queryRunner);
        });
    }
}
