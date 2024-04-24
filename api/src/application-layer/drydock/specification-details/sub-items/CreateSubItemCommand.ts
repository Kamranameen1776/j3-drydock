import { SynchronizerService } from 'j2utils';

import { ApplicationException } from '../../../../bll/drydock/core/exceptions/ApplicationException';
import { getTableName } from '../../../../common/drydock/ts-helpers/tableName';
import { validateAgainstModel } from '../../../../common/drydock/ts-helpers/validate-against-model';
import { SpecificationDetailsRepository } from '../../../../dal/drydock/specification-details/SpecificationDetailsRepository';
import { CreateSubItemParams } from '../../../../dal/drydock/specification-details/sub-items/dto/CreateSubItemParams';
import { SpecificationDetailsSubItemsRepository } from '../../../../dal/drydock/specification-details/sub-items/SpecificationDetailsSubItemsRepository';
import { VesselsRepository } from '../../../../dal/drydock/vessels/VesselsRepository';
import { SpecificationDetailsSubItemEntity } from '../../../../entity/drydock/SpecificationDetailsSubItemEntity';
import { SpecificationSubItemFindingEntity } from '../../../../entity/drydock/SpecificationSubItemFindingEntity';
import { SpecificationSubItemPmsEntity } from '../../../../entity/drydock/SpecificationSubItemPmsJobEntity';
import { Command } from '../../core/cqrs/Command';
import { UnitOfWork } from '../../core/uof/UnitOfWork';

export class CreateSubItemCommand extends Command<CreateSubItemParams, SpecificationDetailsSubItemEntity> {
    protected readonly subItemRepo = new SpecificationDetailsSubItemsRepository();
    protected readonly uow = new UnitOfWork();
    protected readonly tableName = getTableName(SpecificationDetailsSubItemEntity);
    protected readonly specificationDetailsRepository = new SpecificationDetailsRepository();
    protected readonly vesselsRepository = new VesselsRepository();

    private params: CreateSubItemParams;

    protected async ValidationHandlerAsync(request: CreateSubItemParams): Promise<void> {
        this.params = await validateAgainstModel(CreateSubItemParams, request, {
            validate: {
                whitelist: true,
            },
        });
    }

    protected async MainHandlerAsync(): Promise<SpecificationDetailsSubItemEntity> {
        if (await this.specificationDetailsRepository.isSpecificationIsCompleted(this.params.specificationDetailsUid)) {
            throw new ApplicationException('Specification is completed, cannot be updated');
        }

        return this.uow.ExecuteAsync(async (queryRunner) => {
            const vessel = await this.vesselsRepository.GetVesselBySpecification(
                this.params.specificationDetailsUid,
                queryRunner,
            );

            const res = await this.subItemRepo.createOne(this.params, queryRunner);
            await SynchronizerService.dataSynchronizeManager(
                queryRunner.manager,
                this.tableName,
                'uid',
                res.uid,
                vessel.VesselId,
            );

            if (this.params.pmsJobUid?.length) {
                const subItemPmsJobs = await this.subItemRepo.addSubItemPmsJobs(
                    res.uid,
                    this.params.pmsJobUid,
                    queryRunner,
                );

                const condition = `uid IN (${subItemPmsJobs.map((x) => `'${x.uid}'`).join(',')})`;
                await SynchronizerService.dataSynchronizeByConditionManager(
                    queryRunner.manager,
                    getTableName(SpecificationSubItemPmsEntity),
                    vessel.VesselId,
                    condition,
                );
            }

            if (this.params.findingUid?.length) {
                const subItemPmsJobs = await this.subItemRepo.addSubItemFindings(
                    res.uid,
                    this.params.findingUid,
                    queryRunner,
                );

                const condition = `uid IN (${subItemPmsJobs.map((x) => `'${x.uid}'`).join(',')})`;
                await SynchronizerService.dataSynchronizeByConditionManager(
                    queryRunner.manager,
                    getTableName(SpecificationSubItemFindingEntity),
                    vessel.VesselId,
                    condition,
                );
            }

            return res;
        });
    }
}
