import { SynchronizerService } from 'j2utils';

import { ApplicationException } from '../../../../bll/drydock/core/exceptions';
import { getTableName } from '../../../../common/drydock/ts-helpers/tableName';
import { validateAgainstModel } from '../../../../common/drydock/ts-helpers/validate-against-model';
import { SpecificationDetailsRepository } from '../../../../dal/drydock/specification-details/SpecificationDetailsRepository';
import { CreateManyParams } from '../../../../dal/drydock/specification-details/sub-items/dto/CreateManyParams';
import { SpecificationDetailsSubItemsRepository } from '../../../../dal/drydock/specification-details/sub-items/SpecificationDetailsSubItemsRepository';
import { VesselsRepository } from '../../../../dal/drydock/vessels/VesselsRepository';
import { SpecificationDetailsEntity } from '../../../../entity/drydock';
import { SpecificationDetailsSubItemEntity } from '../../../../entity/drydock/SpecificationDetailsSubItemEntity';
import { Command } from '../../core/cqrs/Command';
import { UnitOfWork } from '../../core/uof/UnitOfWork';

export class CreateSubItemsCommand extends Command<CreateManyParams, SpecificationDetailsSubItemEntity[]> {
    protected readonly subItemRepo = new SpecificationDetailsSubItemsRepository();
    protected readonly uow = new UnitOfWork();
    protected readonly tableName = getTableName(SpecificationDetailsSubItemEntity);
    protected readonly vesselsRepository = new VesselsRepository();
    protected readonly specificationDetailsRepository = new SpecificationDetailsRepository();

    private params: CreateManyParams;

    protected async ValidationHandlerAsync(request: CreateManyParams): Promise<void> {
        this.params = await validateAgainstModel(CreateManyParams, request);
    }

    protected async MainHandlerAsync(): Promise<SpecificationDetailsSubItemEntity[]> {
        if (await this.specificationDetailsRepository.isSpecificationIsCompleted(this.params.specificationDetailsUid)) {
            throw new ApplicationException('Specification is completed, cannot be updated');
        }

        return this.uow.ExecuteAsync(async (queryRunner) => {
            const vessel = await this.vesselsRepository.GetVesselBySpecification(
                this.params.specificationDetailsUid,
                queryRunner,
            );

            const res = await this.subItemRepo.createMany(this.params, queryRunner);
            const condition = `uid IN ('${res.map((i) => i.uid).join(`','`)}')`;
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
