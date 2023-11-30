import { SynchronizerService } from 'j2utils';

import { validateAgainstModel } from '../../../../common/drydock/ts-helpers/validate-against-model';
import { DeleteOneParams } from '../../../../dal/drydock/specification-details/sub-items/dto/DeleteOneParams';
import { SpecificationDetailsSubItemsRepository } from '../../../../dal/drydock/specification-details/sub-items/SpecificationDetailsSubItemsRepository';
import { VesselsRepository } from '../../../../dal/drydock/vessels/VesselsRepository';
import { Command } from '../../core/cqrs/Command';
import { UnitOfWork } from '../../core/uof/UnitOfWork';

export class DeleteSubItemCommand extends Command<DeleteOneParams, void> {
    protected readonly subItemsRepo = new SpecificationDetailsSubItemsRepository();
    protected readonly uow = new UnitOfWork();
    protected readonly tableName = 'dry_dock.specification_details_sub_item';
    protected readonly vesselsRepository = new VesselsRepository();

    private params: DeleteOneParams;

    protected async ValidationHandlerAsync(request: DeleteOneParams): Promise<void> {
        this.params = await validateAgainstModel(DeleteOneParams, request);
    }

    public async MainHandlerAsync(): Promise<void> {
        const vessel = await this.vesselsRepository.GetVesselBySpecification(this.params.specificationDetailsUid);
        await this.uow.ExecuteAsync(async (queryRunner) => {
            await this.subItemsRepo.deleteOneExistingByUid(this.params, queryRunner);
            await SynchronizerService.dataSynchronizeManager(
                queryRunner.manager,
                this.tableName,
                'uid',
                this.params.uid,
                vessel.VesselId,
            );
        });
    }
}
