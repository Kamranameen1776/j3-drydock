import { SynchronizerService } from 'j2utils';

import { getTableName } from '../../../../common/drydock/ts-helpers/tableName';
import { SpecificationDetailsRepository } from '../../../../dal/drydock/specification-details/SpecificationDetailsRepository';
import { VesselsRepository } from '../../../../dal/drydock/vessels/VesselsRepository';
import { SpecificationPmsEntity } from '../../../../entity/drydock';
import { Command } from '../../core/cqrs/Command';
import { UnitOfWork } from '../../core/uof/UnitOfWork';
import { UpdateSpecificationPmsDto } from '../dtos/UpdateSpecificationPMSRequestDto';
import { validateAgainstModel } from '../../../../common/drydock/ts-helpers/validate-against-model';

export class DeleteSpecificationPmsCommand extends Command<UpdateSpecificationPmsDto, void> {
    specificationDetailsRepository = new SpecificationDetailsRepository();
    uow = new UnitOfWork();
    tableName = getTableName(SpecificationPmsEntity);
    vesselsRepository: VesselsRepository = new VesselsRepository();

    protected async ValidationHandlerAsync(request: UpdateSpecificationPmsDto): Promise<void> {
        await validateAgainstModel(UpdateSpecificationPmsDto, request);
    }

    protected async MainHandlerAsync(request: UpdateSpecificationPmsDto) {
        const vessel = await this.vesselsRepository.GetVesselBySpecification(request.uid);

        await this.uow.ExecuteAsync(async (queryRunner) => {
            await this.specificationDetailsRepository.deleteSpecificationPms(request, queryRunner);
            const condition = `specification_uid = '${request.uid}'`;
            await SynchronizerService.dataSynchronizeByConditionManager(
                queryRunner.manager,
                this.tableName,
                vessel.VesselId,
                condition,
            );
        });
    }
}
