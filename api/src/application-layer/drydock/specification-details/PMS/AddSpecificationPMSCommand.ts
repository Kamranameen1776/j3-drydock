import { SpecificationDetailsRepository } from '../../../../dal/drydock/specification-details/SpecificationDetailsRepository';
import { Command } from '../../core/cqrs/Command';
import { UnitOfWork } from '../../core/uof/UnitOfWork';
import { UpdateSpecificationPmsRequestDto } from '../dtos/UpdateSpecificationPMSRequestDto';
import {VesselsRepository} from '../../../../dal/drydock/vessels/VesselsRepository';
import {DataUtilService, SynchronizerService} from 'j2utils';

export class AddSpecificationPmsCommand extends Command<UpdateSpecificationPmsRequestDto, void> {
    specificationDetailsRepository = new SpecificationDetailsRepository();
    uow = new UnitOfWork();
    tableName: 'dry_dock.specification_details';
    vesselsRepository: VesselsRepository = new VesselsRepository();
    protected async MainHandlerAsync(request: UpdateSpecificationPmsRequestDto) {
        const data = request.body.PmsIds.map((PMSUid) => {
            return {
                uid: DataUtilService.newUid(),
                SpecificationUid: request.body.uid,
                PMSUid,
            };
        });
        await this.uow.ExecuteAsync(async (queryRunner) => {
            await this.specificationDetailsRepository.addSpecificationPms(data, queryRunner);
            const vessel = await this.vesselsRepository.GetVesselBySpecification(request.body.uid);
            //TODO: think, if promise.all can be replaced with SynchronizerService.dataSynchronizeByConditionManager
            const promises = data.map((item: { uid: string }) =>
                SynchronizerService.dataSynchronizeManager(
                    queryRunner.manager,
                    this.tableName,
                    'uid',
                    item.uid,
                    vessel.VesselId,
                ),
            );
            await Promise.all(promises);
            return;
        });
    }
}
