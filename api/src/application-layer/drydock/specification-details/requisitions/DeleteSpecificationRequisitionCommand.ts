import { Request } from 'express';
import { SynchronizerService } from 'j2utils';

import { getTableName } from '../../../../common/drydock/ts-helpers/tableName';
import { SpecificationDetailsRepository } from '../../../../dal/drydock/specification-details/SpecificationDetailsRepository';
import { VesselsRepository } from '../../../../dal/drydock/vessels/VesselsRepository';
import { SpecificationRequisitionsEntity } from '../../../../entity/drydock';
import { Command } from '../../core/cqrs/Command';
import { UnitOfWork } from '../../core/uof/UnitOfWork';
import { DeleteSpecificationRequisitionsRequestDto } from '../dtos/DeleteSpecificationRequisitionsRequestDto';

export class DeleteSpecificationRequisitionCommand extends Command<Request, void> {
    specificationDetailsRepository = new SpecificationDetailsRepository();
    uow = new UnitOfWork();
    tableName = getTableName(SpecificationRequisitionsEntity);
    vesselsRepository: VesselsRepository = new VesselsRepository();

    protected async MainHandlerAsync(request: Request) {
        const body: DeleteSpecificationRequisitionsRequestDto = request.body;
        return this.uow.ExecuteAsync(async (queryRunner) => {
            const vessel = await this.vesselsRepository.GetVesselBySpecification(body.specificationUid, queryRunner);
            await this.specificationDetailsRepository.deleteSpecificationRequisitions(body, queryRunner);
            const condition = `specification_uid = '${body.specificationUid}'
                AND requisition_uid = '${body.requisitionUid}')`;
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
