import { SynchronizerService } from 'j2utils';

import { getTableName } from '../../../../common/drydock/ts-helpers/tableName';
import { validateAgainstModel } from '../../../../common/drydock/ts-helpers/validate-against-model';
import { SpecificationDetailsRepository } from '../../../../dal/drydock/specification-details/SpecificationDetailsRepository';
import { VesselsRepository } from '../../../../dal/drydock/vessels/VesselsRepository';
import { SpecificationRequisitionsEntity } from '../../../../entity/drydock';
import { Command } from '../../core/cqrs/Command';
import { UnitOfWork } from '../../core/uof/UnitOfWork';
import { LinkSpecificationRequisitionsRequestDto } from '../dtos/LinkSpecificationRequisitionsRequestDto';

export class LinkSpecificationRequisitionCommand extends Command<
    LinkSpecificationRequisitionsRequestDto,
    SpecificationRequisitionsEntity[]
> {
    specificationDetailsRepository = new SpecificationDetailsRepository();
    uow = new UnitOfWork();
    tableName = getTableName(SpecificationRequisitionsEntity);
    vesselsRepository: VesselsRepository = new VesselsRepository();

    protected async ValidationHandlerAsync(request: LinkSpecificationRequisitionsRequestDto): Promise<void> {
        await validateAgainstModel(LinkSpecificationRequisitionsRequestDto, request);
    }

    protected async MainHandlerAsync(request: LinkSpecificationRequisitionsRequestDto) {
        return this.uow.ExecuteAsync(async (queryRunner) => {
            const vessel = await this.vesselsRepository.GetVesselBySpecification(request.specificationUid, queryRunner);

            const result = await this.specificationDetailsRepository.linkSpecificationRequisitions(
                request,
                queryRunner,
            );

            const condition = `specification_uid = '${request.specificationUid}'
                AND requisition_uid IN ('${request.requisitionUid.join(`','`)}')`;

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
