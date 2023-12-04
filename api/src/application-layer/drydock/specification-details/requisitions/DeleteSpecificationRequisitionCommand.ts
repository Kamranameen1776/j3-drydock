import { Request } from 'express';
import { SynchronizerService } from 'j2utils';

import { SpecificationDetailsRepository } from '../../../../dal/drydock/specification-details/SpecificationDetailsRepository';
import { VesselsRepository } from '../../../../dal/drydock/vessels/VesselsRepository';
import { Command } from '../../core/cqrs/Command';
import { UnitOfWork } from '../../core/uof/UnitOfWork';
import { DeleteSpecificationRequisitionsRequestDto } from '../dtos/DeleteSpecificationRequisitionsRequestDto';

export class DeleteSpecificationRequisitionCommand extends Command<Request, void> {
    specificationDetailsRepository = new SpecificationDetailsRepository();
    uow = new UnitOfWork();
    tableName = 'dry_dock.specification_requisitions';
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
                'dry_dock.specification_requisitions',
                vessel.VesselId,
                condition,
            );
            return;
        });
    }
}
