import { SynchronizerService } from 'j2utils';

import { ApplicationException } from '../../../../bll/drydock/core/exceptions';
import { getTableName } from '../../../../common/drydock/ts-helpers/tableName';
import { validateAgainstModel } from '../../../../common/drydock/ts-helpers/validate-against-model';
import { SpecificationDetailsRepository } from '../../../../dal/drydock/specification-details/SpecificationDetailsRepository';
import { UpdateSubItemUtilizedDto } from '../../../../dal/drydock/specification-details/sub-items/dto/UpdateSubItemUtilizedDto';
import { SpecificationDetailsSubItemsRepository } from '../../../../dal/drydock/specification-details/sub-items/SpecificationDetailsSubItemsRepository';
import { VesselsRepository } from '../../../../dal/drydock/vessels/VesselsRepository';
import { SpecificationDetailsSubItemEntity } from '../../../../entity/drydock/SpecificationDetailsSubItemEntity';
import { Command } from '../../core/cqrs/Command';
import { UnitOfWork } from '../../core/uof/UnitOfWork';

export class UpdateSubItemUtilizedCommand extends Command<UpdateSubItemUtilizedDto, void> {
    protected readonly subItemRepo = new SpecificationDetailsSubItemsRepository();
    protected readonly uow = new UnitOfWork();
    protected readonly tableName = getTableName(SpecificationDetailsSubItemEntity);
    protected readonly vesselsRepository = new VesselsRepository();
    protected readonly specificationDetailsRepository = new SpecificationDetailsRepository();

    protected async ValidationHandlerAsync(body: UpdateSubItemUtilizedDto): Promise<void> {
        await validateAgainstModel(UpdateSubItemUtilizedDto, body);
    }

    protected async MainHandlerAsync(request: UpdateSubItemUtilizedDto): Promise<void> {
        return this.uow.ExecuteAsync(async (queryRunner) => {
            const vessel = await this.vesselsRepository.GetVesselBySpecification(
                request.specificationDetailsUid,
                queryRunner,
            );

            await Promise.all(
                request.subItems.map(async (subItem) => {
                    const subItemData: Partial<SpecificationDetailsSubItemEntity> = {
                        uid: subItem.uid,
                        utilized: subItem.utilized,
                        updated_by: request.userUid,
                    };

                    return this.subItemRepo.updateRawSubItem(subItemData, queryRunner);
                }),
            );

            const conditionSubItems = `uid IN ('${request.subItems.map((i) => i.uid).join(`','`)}')`;
            await SynchronizerService.dataSynchronizeByConditionManager(
                queryRunner.manager,
                this.tableName,
                vessel.VesselId,
                conditionSubItems,
            );
        });
    }
}
