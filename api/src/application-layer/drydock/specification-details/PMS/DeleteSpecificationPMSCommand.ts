import { SynchronizerService } from 'j2utils';

import { getTableName } from '../../../../common/drydock/ts-helpers/tableName';
import { SpecificationDetailsRepository } from '../../../../dal/drydock/specification-details/SpecificationDetailsRepository';
import { VesselsRepository } from '../../../../dal/drydock/vessels/VesselsRepository';
import { SpecificationPmsEntity } from '../../../../entity/drydock';
import { Command } from '../../core/cqrs/Command';
import { UnitOfWork } from '../../core/uof/UnitOfWork';
import { UpdateSpecificationPmsRequestDto } from '../dtos/UpdateSpecificationPMSRequestDto';

export class DeleteSpecificationPmsCommand extends Command<UpdateSpecificationPmsRequestDto, void> {
    specificationDetailsRepository = new SpecificationDetailsRepository();
    uow = new UnitOfWork();
    tableName = getTableName(SpecificationPmsEntity);
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
