import { SynchronizerService } from 'j2utils';

import { getTableName } from '../../../../common/drydock/ts-helpers/tableName';
import { validateAgainstModel } from '../../../../common/drydock/ts-helpers/validate-against-model';
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
    protected readonly vesselsRepository = new VesselsRepository();

    private params: CreateSubItemParams;

    protected async ValidationHandlerAsync(request: CreateSubItemParams): Promise<void> {
        // FIXME: (create-sub-item) 1.1.1 validate request
        this.params = await validateAgainstModel(CreateSubItemParams, request, {
            validate: {
                whitelist: true,
            },
        });
    }

    protected async MainHandlerAsync(): Promise<SpecificationDetailsSubItemEntity> {
        return this.uow.ExecuteAsync(async (queryRunner) => {
            const vessel = await this.vesselsRepository.GetVesselBySpecification(
                this.params.specificationDetailsUid,
                queryRunner,
            );

            // FIXME: (create-sub-item) 1.1.2 create sub-item
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

            // FIXME: (create-sub-item) 1.1.3 return created sub-item
            return res;
        });
    }
}
