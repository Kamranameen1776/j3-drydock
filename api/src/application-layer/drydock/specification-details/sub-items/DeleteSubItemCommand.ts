import { SynchronizerService } from 'j2utils';

import { ApplicationException } from '../../../../bll/drydock/core/exceptions/ApplicationException';
import { getTableName } from '../../../../common/drydock/ts-helpers/tableName';
import { validateAgainstModel } from '../../../../common/drydock/ts-helpers/validate-against-model';
import { SpecificationDetailsRepository } from '../../../../dal/drydock/specification-details/SpecificationDetailsRepository';
import { DeleteSubItemParams } from '../../../../dal/drydock/specification-details/sub-items/dto/DeleteSubItemParams';
import { SpecificationDetailsSubItemsRepository } from '../../../../dal/drydock/specification-details/sub-items/SpecificationDetailsSubItemsRepository';
import { VesselsRepository } from '../../../../dal/drydock/vessels/VesselsRepository';
import { SpecificationDetailsSubItemEntity } from '../../../../entity/drydock/SpecificationDetailsSubItemEntity';
import { Command } from '../../core/cqrs/Command';
import { UnitOfWork } from '../../core/uof/UnitOfWork';

export class DeleteSubItemCommand extends Command<DeleteSubItemParams, void> {
    protected readonly subItemsRepo = new SpecificationDetailsSubItemsRepository();
    protected readonly uow = new UnitOfWork();
    protected readonly tableName = getTableName(SpecificationDetailsSubItemEntity);
    protected readonly vesselsRepository = new VesselsRepository();
    protected readonly specificationDetailsRepository = new SpecificationDetailsRepository();

    private params: DeleteSubItemParams;

    public async MainHandlerAsync(): Promise<void> {
        if (await this.specificationDetailsRepository.isSpecificationIsCompleted(this.params.specificationDetailsUid)) {
            throw new ApplicationException('Specification is completed, cannot be updated');
        }

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

            await this.subItemsRepo.deleteAllSubItemRelations(this.params.uid, queryRunner);
            await SynchronizerService.dataSynchronizeByConditionManager(
                queryRunner.manager,
                getTableName(SpecificationDetailsSubItemEntity),
                vessel.VesselId,
                `uid = '${this.params.uid}'`,
            );
        });
    }

    protected async ValidationHandlerAsync(request: DeleteSubItemParams): Promise<void> {
        this.params = await validateAgainstModel(DeleteSubItemParams, request);
    }
}
