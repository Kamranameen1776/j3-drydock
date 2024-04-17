import { SynchronizerService } from 'j2utils';

import { ApplicationException } from '../../../../bll/drydock/core/exceptions';
import { type EntityExistenceMap } from '../../../../common/drydock/ts-helpers/calculate-entity-existence-map';
import { getTableName } from '../../../../common/drydock/ts-helpers/tableName';
import { validateAgainstModel } from '../../../../common/drydock/ts-helpers/validate-against-model';
import { SpecificationDetailsRepository } from '../../../../dal/drydock/specification-details/SpecificationDetailsRepository';
import { DeleteManyParams } from '../../../../dal/drydock/specification-details/sub-items/dto/DeleteManyParams';
import { SpecificationDetailsSubItemsRepository } from '../../../../dal/drydock/specification-details/sub-items/SpecificationDetailsSubItemsRepository';
import { VesselsRepository } from '../../../../dal/drydock/vessels/VesselsRepository';
import { SpecificationDetailsEntity } from '../../../../entity/drydock';
import { SpecificationDetailsSubItemEntity } from '../../../../entity/drydock/SpecificationDetailsSubItemEntity';
import { Command } from '../../core/cqrs/Command';
import { UnitOfWork } from '../../core/uof/UnitOfWork';

export class DeleteSubItemsCommand extends Command<DeleteManyParams, EntityExistenceMap> {
    protected readonly subItemsRepo = new SpecificationDetailsSubItemsRepository();
    protected readonly uow = new UnitOfWork();
    protected readonly tableName = getTableName(SpecificationDetailsSubItemEntity);
    protected readonly vesselsRepository = new VesselsRepository();
    protected readonly specificationDetailsRepository = new SpecificationDetailsRepository();

    private params: DeleteManyParams;

    protected async ValidationHandlerAsync(request: DeleteManyParams): Promise<void> {
        this.params = await validateAgainstModel(DeleteManyParams, request);
    }

    protected async MainHandlerAsync(): Promise<EntityExistenceMap> {
        if (await this.specificationDetailsRepository.isSpecificationIsCompleted(this.params.specificationDetailsUid)) {
            throw new ApplicationException('Specification is completed, cannot be updated');
        }

        return this.uow.ExecuteAsync(async (queryRunner) => {
            const vessel = await this.vesselsRepository.GetVesselBySpecification(
                this.params.specificationDetailsUid,
                queryRunner,
            );

            const res = await this.subItemsRepo.deleteManyByUids(this.params, queryRunner);
            const condition = `uid IN ('${this.params.uids.join(`','`)}')`;
            await SynchronizerService.dataSynchronizeByConditionManager(
                queryRunner.manager,
                this.tableName,
                vessel.VesselId,
                condition,
            );

            await this.specificationDetailsRepository.updateEstimatedCost(
                this.params.specificationDetailsUid,
                queryRunner,
            );

            await SynchronizerService.dataSynchronizeManager(
                queryRunner.manager,
                getTableName(SpecificationDetailsEntity),
                'uid',
                this.params.specificationDetailsUid,
                vessel.VesselId,
            );

            return res;
        });
    }
}
