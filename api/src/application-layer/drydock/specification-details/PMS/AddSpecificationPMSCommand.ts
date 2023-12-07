import { DataUtilService, SynchronizerService } from 'j2utils';

import { SpecificationDetailsRepository } from '../../../../dal/drydock/specification-details/SpecificationDetailsRepository';
import { VesselsRepository } from '../../../../dal/drydock/vessels/VesselsRepository';
import { Command } from '../../core/cqrs/Command';
import { UnitOfWork } from '../../core/uof/UnitOfWork';
import { UpdateSpecificationPmsRequestDto } from '../dtos/UpdateSpecificationPMSRequestDto';

export class AddSpecificationPmsCommand extends Command<UpdateSpecificationPmsRequestDto, void> {
    specificationDetailsRepository = new SpecificationDetailsRepository();
    uow = new UnitOfWork();
    tableName = 'dry_dock.specification_details_j3_pms_agg_job';
    vesselsRepository: VesselsRepository = new VesselsRepository();

    protected async MainHandlerAsync(request: UpdateSpecificationPmsRequestDto) {
        const data = request.body.PmsIds.map((PMSUid) => {
            return {
                uid: DataUtilService.newUid(),
                SpecificationUid: request.body.uid,
                PMSUid,
            };
        });
        const vessel = await this.vesselsRepository.GetVesselBySpecification(request.body.uid);

        await this.uow.ExecuteAsync(async (queryRunner) => {
            await this.specificationDetailsRepository.addSpecificationPms(data, queryRunner);
            const condition = `uid IN ('${data.map((i) => i.uid).join(`','`)}')`;
            await SynchronizerService.dataSynchronizeByConditionManager(
                queryRunner.manager,
                this.tableName,
                vessel.VesselId,
                condition,
            );
            return;
        });
    }
}
