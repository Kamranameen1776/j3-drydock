import { SynchronizerService } from 'j2utils';

import { getTableName } from '../../../../common/drydock/ts-helpers/tableName';
import { validateAgainstModel } from '../../../../common/drydock/ts-helpers/validate-against-model';
import { UpdateSubItemParams } from '../../../../dal/drydock/specification-details/sub-items/dto/UpdateSubItemParams';
import { SpecificationDetailsSubItemsRepository } from '../../../../dal/drydock/specification-details/sub-items/SpecificationDetailsSubItemsRepository';
import { VesselsRepository } from '../../../../dal/drydock/vessels/VesselsRepository';
import { SpecificationDetailsSubItemEntity } from '../../../../entity/drydock/SpecificationDetailsSubItemEntity';
import { SpecificationSubItemPmsEntity } from '../../../../entity/drydock/SpecificationSubItemPmsJobEntity';
import { Command } from '../../core/cqrs/Command';
import { UnitOfWork } from '../../core/uof/UnitOfWork';

export class UpdateSubItemCommand extends Command<UpdateSubItemParams, SpecificationDetailsSubItemEntity> {
    protected readonly subItemRepo = new SpecificationDetailsSubItemsRepository();
    protected readonly uow = new UnitOfWork();
    protected readonly tableName = getTableName(SpecificationDetailsSubItemEntity);
    protected readonly vesselsRepository = new VesselsRepository();
    private params: UpdateSubItemParams;

    protected async ValidationHandlerAsync(request: UpdateSubItemParams): Promise<void> {
        this.params = await validateAgainstModel(UpdateSubItemParams, request, {
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

            const res = await this.subItemRepo.updateOneExistingByUid(this.params, queryRunner);
            await SynchronizerService.dataSynchronizeManager(
                queryRunner.manager,
                this.tableName,
                'uid',
                this.params.uid,
                vessel.VesselId,
            );

            if (!this.params.pmsJobs) {
                return res;
            }

            if (this.params.pmsJobs.linkedUids?.length) {
                await this.subItemRepo.addSubItemPmsJobs(this.params.uid, this.params.pmsJobs.linkedUids, queryRunner);
            }

            if (this.params.pmsJobs.unlinkedUids?.length) {
                await this.subItemRepo.deleteSubItemPmsJobs(
                    this.params.uid,
                    this.params.pmsJobs.unlinkedUids,
                    queryRunner,
                );
            }

            const uids = [...this.params.pmsJobs.linkedUids, ...this.params.pmsJobs.unlinkedUids];
            if (uids.length) {
                const condition = `uid IN (${uids.map((x) => `'${x}'`).join(',')})`;

                await SynchronizerService.dataSynchronizeByConditionManager(
                    queryRunner.manager,
                    getTableName(SpecificationSubItemPmsEntity),
                    vessel.VesselId,
                    condition,
                );
            }

            return res;
        });
    }
}
