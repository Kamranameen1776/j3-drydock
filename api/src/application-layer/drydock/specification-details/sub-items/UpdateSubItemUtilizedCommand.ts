import { AccessRights, SynchronizerService } from 'j2utils';

import { Req } from '../../../../common/drydock/ts-helpers/req-res';
import { getTableName } from '../../../../common/drydock/ts-helpers/tableName';
import { UpdateSubItemUtilizedDto } from '../../../../dal/drydock/specification-details/sub-items/dto/UpdateSubItemUtilizedDto';
import { SpecificationDetailsSubItemsRepository } from '../../../../dal/drydock/specification-details/sub-items/SpecificationDetailsSubItemsRepository';
import { VesselsRepository } from '../../../../dal/drydock/vessels/VesselsRepository';
import { SpecificationDetailsSubItemEntity } from '../../../../entity/drydock/SpecificationDetailsSubItemEntity';
import { Command } from '../../core/cqrs/Command';
import { UnitOfWork } from '../../core/uof/UnitOfWork';

export class UpdateSubItemUtilizedCommand extends Command<Req<UpdateSubItemUtilizedDto>, void> {
    protected readonly subItemRepo = new SpecificationDetailsSubItemsRepository();
    protected readonly uow = new UnitOfWork();
    protected readonly tableName = getTableName(SpecificationDetailsSubItemEntity);
    protected readonly vesselsRepository = new VesselsRepository();

    protected async MainHandlerAsync(request: Req<UpdateSubItemUtilizedDto>): Promise<void> {
        const body = request.body;
        const { UserUID: updatedBy } = AccessRights.authorizationDecode(request);

        return this.uow.ExecuteAsync(async (queryRunner) => {
            const vessel = await this.vesselsRepository.GetVesselBySpecification(
                body.specificationDetailsUid,
                queryRunner,
            );

            await Promise.all(
                body.subItems.map(async (subItem) => {
                    const subItemData: Partial<SpecificationDetailsSubItemEntity> = {
                        uid: subItem.uid,
                        utilized: subItem.utilized,
                        updated_by: updatedBy,
                    };

                    return this.subItemRepo.updateRawSubItem(subItemData, queryRunner);
                }),
            );

            const conditionSubItems = `uid IN ('${body.subItems.map((i) => i.uid).join(`','`)}')`;
            await SynchronizerService.dataSynchronizeByConditionManager(
                queryRunner.manager,
                this.tableName,
                vessel.VesselId,
                conditionSubItems,
            );
        });
    }
}
