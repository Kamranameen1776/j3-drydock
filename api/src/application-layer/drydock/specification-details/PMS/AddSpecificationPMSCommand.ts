import { DataUtilService, SynchronizerService } from 'j2utils';

import { ApplicationException } from '../../../../bll/drydock/core/exceptions/ApplicationException';
import { getTableName } from '../../../../common/drydock/ts-helpers/tableName';
import { validateAgainstModel } from '../../../../common/drydock/ts-helpers/validate-against-model';
import { SpecificationDetailsRepository } from '../../../../dal/drydock/specification-details/SpecificationDetailsRepository';
import { VesselsRepository } from '../../../../dal/drydock/vessels/VesselsRepository';
import { SpecificationPmsEntity } from '../../../../entity/drydock';
import { Command } from '../../core/cqrs/Command';
import { UnitOfWork } from '../../core/uof/UnitOfWork';
import { UpdateSpecificationPmsDto } from '../dtos/UpdateSpecificationPMSRequestDto';

export class AddSpecificationPmsCommand extends Command<UpdateSpecificationPmsDto, void> {
    specificationDetailsRepository = new SpecificationDetailsRepository();
    uow = new UnitOfWork();
    tableName = getTableName(SpecificationPmsEntity);
    vesselsRepository: VesselsRepository = new VesselsRepository();

    protected async ValidationHandlerAsync(request: UpdateSpecificationPmsDto): Promise<void> {
        await validateAgainstModel(UpdateSpecificationPmsDto, request);
    }

    protected async MainHandlerAsync(request: UpdateSpecificationPmsDto) {
        if (await this.specificationDetailsRepository.isSpecificationIsCompleted(request.uid)) {
            throw new ApplicationException('Specification is completed, cannot be updated');
        }

        const data = request.PmsIds.map((PMSUid) => {
            return {
                uid: DataUtilService.newUid(),
                SpecificationUid: request.uid,
                PMSUid,
            };
        });

        const vessel = await this.vesselsRepository.GetVesselBySpecification(request.uid);

        await this.uow.ExecuteAsync(async (queryRunner) => {
            await this.specificationDetailsRepository.addSpecificationPms(data, queryRunner);

            const condition = `uid IN ('${data.map((i) => i.uid).join(`','`)}')`;

            await SynchronizerService.dataSynchronizeByConditionManager(
                queryRunner.manager,
                this.tableName,
                vessel.VesselId,
                condition,
            );
        });
    }
}
