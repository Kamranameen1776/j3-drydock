import { SynchronizerService } from 'j2utils';

import { type EntityExistenceMap } from '../../../../common/drydock/ts-helpers/calculate-entity-existence-map';
import { validateAgainstModel } from '../../../../common/drydock/ts-helpers/validate-against-model';
import { DeleteManyParams } from '../../../../dal/drydock/specification-details/sub-items/dto/DeleteManyParams';
import { SpecificationDetailsSubItemsRepository } from '../../../../dal/drydock/specification-details/sub-items/SpecificationDetailsSubItemsRepository';
import { VesselsRepository } from '../../../../dal/drydock/vessels/VesselsRepository';
import { Command } from '../../core/cqrs/Command';
import { UnitOfWork } from '../../core/uof/UnitOfWork';

export class DeleteSubItemsCommand extends Command<DeleteManyParams, EntityExistenceMap> {
    protected readonly subItemsRepo = new SpecificationDetailsSubItemsRepository();
    protected readonly uow = new UnitOfWork();
    protected readonly tableName = 'dry_dock.specification_details_sub_item';
    protected readonly vesselsRepository = new VesselsRepository();

    private params: DeleteManyParams;

    protected async ValidationHandlerAsync(request: DeleteManyParams): Promise<void> {
        this.params = await validateAgainstModel(DeleteManyParams, request);
    }

    protected async MainHandlerAsync(): Promise<EntityExistenceMap> {
        return this.uow.ExecuteAsync(async (queryRunner) => {
            const res = await this.subItemsRepo.deleteManyByUids(this.params, queryRunner);
            const condition = `uid IN ('${this.params.uids.join(`','`)}')`;
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
