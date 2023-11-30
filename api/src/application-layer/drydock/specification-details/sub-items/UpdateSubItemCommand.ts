import { SynchronizerService } from 'j2utils';

import { validateAgainstModel } from '../../../../common/drydock/ts-helpers/validate-against-model';
import { UpdateOneParams } from '../../../../dal/drydock/specification-details/sub-items/dto/UpdateOneParams';
import { SpecificationDetailsSubItemsRepository } from '../../../../dal/drydock/specification-details/sub-items/SpecificationDetailsSubItemsRepository';
import { VesselsRepository } from '../../../../dal/drydock/vessels/VesselsRepository';
import { type SpecificationDetailsSubItemEntity } from '../../../../entity/drydock/SpecificationDetailsSubItemEntity';
import { Command } from '../../core/cqrs/Command';
import { UnitOfWork } from '../../core/uof/UnitOfWork';

export class UpdateSubItemCommand extends Command<UpdateOneParams, SpecificationDetailsSubItemEntity> {
    protected readonly subItemRepo = new SpecificationDetailsSubItemsRepository();
    protected readonly uow = new UnitOfWork();
    protected readonly tableName = 'dry_dock.specification_details_sub_item';
    protected readonly vesselsRepository = new VesselsRepository();
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
            const res = await this.subItemRepo.updateOneExistingByUid(this.params, queryRunner);
            const vessel = await this.vesselsRepository.GetVesselBySpecification(this.params.specificationDetailsUid);
            await SynchronizerService.dataSynchronizeManager(
                queryRunner.manager,
                this.tableName,
                'uid',
                this.params.uid,
                vessel.VesselId,
            );
            return res;
        });
    }
}
