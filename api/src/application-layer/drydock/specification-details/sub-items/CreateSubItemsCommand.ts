import { SynchronizerService } from 'j2utils';

import { validateAgainstModel } from '../../../../common/drydock/ts-helpers/validate-against-model';
import { CreateManyParams } from '../../../../dal/drydock/specification-details/sub-items/dto/CreateManyParams';
import { SpecificationDetailsSubItemsRepository } from '../../../../dal/drydock/specification-details/sub-items/SpecificationDetailsSubItemsRepository';
import { VesselsRepository } from '../../../../dal/drydock/vessels/VesselsRepository';
import { SpecificationDetailsSubItemEntity } from '../../../../entity/drydock/SpecificationDetailsSubItemEntity';
import { Command } from '../../core/cqrs/Command';
import { UnitOfWork } from '../../core/uof/UnitOfWork';

export class CreateSubItemsCommand extends Command<CreateManyParams, SpecificationDetailsSubItemEntity[]> {
    protected readonly subItemRepo = new SpecificationDetailsSubItemsRepository();
    protected readonly uow = new UnitOfWork();
    protected readonly tableName = 'dry_dock.specification_details_sub_item';
    protected readonly vesselsRepository = new VesselsRepository();

    private params: CreateManyParams;

    protected async ValidationHandlerAsync(request: CreateManyParams): Promise<void> {
        this.params = await validateAgainstModel(CreateManyParams, request);
    }

    protected async MainHandlerAsync(): Promise<SpecificationDetailsSubItemEntity[]> {
        return this.uow.ExecuteAsync(async (queryRunner) => {
            const res = await this.subItemRepo.createMany(this.params, queryRunner);
            const condition = `uid IN ('${res.map((i) => i.uid).join(`','`)}')`;
            const vessel = await this.vesselsRepository.GetVesselBySpecification(this.params.specificationDetailsUid);
            await SynchronizerService.dataSynchronizeByConditionManager(
                queryRunner.manager,
                this.tableName,
                vessel.VesselId,
                condition,
            );
            return res;
        });
    }
}
