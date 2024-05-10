import { SynchronizerService } from 'j2utils';

import { getTableName } from '../../../../common/drydock/ts-helpers/tableName';
import { validateAgainstModel } from '../../../../common/drydock/ts-helpers/validate-against-model';
import { SpecificationDetailsRepository } from '../../../../dal/drydock/specification-details/SpecificationDetailsRepository';
import { VesselsRepository } from '../../../../dal/drydock/vessels/VesselsRepository';
import { SpecificationRequisitionsEntity } from '../../../../entity/drydock';
import { Command } from '../../core/cqrs/Command';
import { UnitOfWork } from '../../core/uof/UnitOfWork';
import { DeleteSpecificationRequisitionsRequestDto } from '../dtos/DeleteSpecificationRequisitionsRequestDto';

export class DeleteSpecificationRequisitionCommand extends Command<DeleteSpecificationRequisitionsRequestDto, void> {
    specificationDetailsRepository = new SpecificationDetailsRepository();
    uow = new UnitOfWork();
    tableName = getTableName(SpecificationRequisitionsEntity);
    vesselsRepository: VesselsRepository = new VesselsRepository();

    protected async ValidationHandlerAsync(request: DeleteSpecificationRequisitionsRequestDto): Promise<void> {
        await validateAgainstModel(DeleteSpecificationRequisitionsRequestDto, request);
    }

    protected async MainHandlerAsync(request: DeleteSpecificationRequisitionsRequestDto) {
        return this.uow.ExecuteAsync(async (queryRunner) => {
            const vessel = await this.vesselsRepository.GetVesselBySpecification(request.specificationUid, queryRunner);

            await this.specificationDetailsRepository.deleteSpecificationRequisitions(request, queryRunner);

            const condition = `specification_uid = '${request.specificationUid}'
                AND requisition_uid = '${request.requisitionUid}')`;

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
