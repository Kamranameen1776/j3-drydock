import { SynchronizerService } from 'j2utils';

import { getTableName } from '../../../../common/drydock/ts-helpers/tableName';
import { validateAgainstModel } from '../../../../common/drydock/ts-helpers/validate-against-model';
import { DeleteOneParams } from '../../../../dal/drydock/specification-details/sub-items/dto/DeleteOneParams';
import { SpecificationDetailsSubItemsRepository } from '../../../../dal/drydock/specification-details/sub-items/SpecificationDetailsSubItemsRepository';
import { VesselsRepository } from '../../../../dal/drydock/vessels/VesselsRepository';
import { SpecificationDetailsSubItemEntity } from '../../../../entity/drydock/SpecificationDetailsSubItemEntity';
import { Command } from '../../core/cqrs/Command';
import { UnitOfWork } from '../../core/uof/UnitOfWork';

export class DeleteSubItemCommand extends Command<DeleteOneParams, void> {
    protected readonly subItemsRepo = new SpecificationDetailsSubItemsRepository();
    protected readonly uow = new UnitOfWork();
    protected readonly tableName = getTableName(SpecificationDetailsSubItemEntity);
    protected readonly vesselsRepository = new VesselsRepository();

    private params: DeleteOneParams;

    public async MainHandlerAsync(): Promise<void> {
        await this.uow.ExecuteAsync(async (queryRunner) => {
            const vessel = await this.vesselsRepository.GetVesselBySpecification(
                this.params.specificationDetailsUid,
                queryRunner,
            );

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

    protected async ValidationHandlerAsync(request: DeleteOneParams): Promise<void> {
        this.params = await validateAgainstModel(DeleteOneParams, request);
    }
}
