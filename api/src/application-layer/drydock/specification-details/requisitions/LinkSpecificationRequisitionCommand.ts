import { Request } from 'express';
import { SynchronizerService } from 'j2utils';

import { SpecificationDetailsRepository } from '../../../../dal/drydock/specification-details/SpecificationDetailsRepository';
import { VesselsRepository } from '../../../../dal/drydock/vessels/VesselsRepository';
import { SpecificationRequisitionsEntity } from '../../../../entity/drydock';
import { Command } from '../../core/cqrs/Command';
import { UnitOfWork } from '../../core/uof/UnitOfWork';
import { LinkSpecificationRequisitionsRequestDto } from '../dtos/LinkSpecificationRequisitionsRequestDto';

export class LinkSpecificationRequisitionCommand extends Command<Request, SpecificationRequisitionsEntity[]> {
    specificationDetailsRepository = new SpecificationDetailsRepository();
    uow = new UnitOfWork();
    tableName = 'dry_dock.specification_requisitions';
    vesselsRepository: VesselsRepository = new VesselsRepository();

    protected async MainHandlerAsync(request: Request) {
        const body: LinkSpecificationRequisitionsRequestDto = request.body;
        return this.uow.ExecuteAsync(async (queryRunner) => {
            const vessel = await this.vesselsRepository.GetVesselBySpecification(body.specificationUid, queryRunner);
            const result = await this.specificationDetailsRepository.linkSpecificationRequisitions(body, queryRunner);
            const condition = `specification_uid = '${body.specificationUid}'
                AND requisition_uid IN ('${body.requisitionUid.join(`','`)}')`;
            await SynchronizerService.dataSynchronizeByConditionManager(
                queryRunner.manager,
                this.tableName,
                vessel.VesselId,
                condition,
            );
            return result;
        });
    }
}
