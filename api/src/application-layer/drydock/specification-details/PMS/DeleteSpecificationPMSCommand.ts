import { SynchronizerService } from 'j2utils';

import { SpecificationDetailsRepository } from '../../../../dal/drydock/specification-details/SpecificationDetailsRepository';
import { VesselsRepository } from '../../../../dal/drydock/vessels/VesselsRepository';
import { Command } from '../../core/cqrs/Command';
import { UnitOfWork } from '../../core/uof/UnitOfWork';
import { UpdateSpecificationPmsRequestDto } from '../dtos/UpdateSpecificationPMSRequestDto';

export class DeleteSpecificationPmsCommand extends Command<UpdateSpecificationPmsRequestDto, void> {
    specificationDetailsRepository = new SpecificationDetailsRepository();
    uow = new UnitOfWork();
    tableName = 'dry_dock.specification_details_j3_pms_agg_job';
    vesselsRepository: VesselsRepository = new VesselsRepository();

    protected async MainHandlerAsync(request: UpdateSpecificationPmsRequestDto) {
        const vessel = await this.vesselsRepository.GetVesselBySpecification(request.body.uid);

        await this.uow.ExecuteAsync(async (queryRunner) => {
            await this.specificationDetailsRepository.deleteSpecificationPms(request.body, queryRunner);
            const condition = `specification_uid = '${request.body.uid}'`;
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
