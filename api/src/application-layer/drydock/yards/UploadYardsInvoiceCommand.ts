import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { Request } from 'express';
import { SynchronizerService } from 'j2utils';

import { UploadInvoiceService } from '../../../bll/drydock/yards/upload';
import { SpecificationDetailsSubItemsRepository } from '../../../dal/drydock/specification-details/sub-items/SpecificationDetailsSubItemsRepository';
import { VesselsRepository } from '../../../dal/drydock/vessels/VesselsRepository';
import { YardsRepository } from '../../../dal/drydock/yards/YardsRepository';
import { Command } from '../core/cqrs/Command';
import { UnitOfWork } from '../core/uof/UnitOfWork';
import { UploadBody } from './dtos/InvoiceDto';

export class UploadYardsInvoiceCommand extends Command<Request, void> {
    yardsRepository = new YardsRepository();
    uploadService = new UploadInvoiceService();
    vesselRepository = new VesselsRepository();
    uow: UnitOfWork = new UnitOfWork();
    tableName = 'specification_details_sub_item';
    protected readonly subItemRepo = new SpecificationDetailsSubItemsRepository();
    /**
     * @returns All yard details
     */
    protected async ValidationHandlerAsync(request: Request): Promise<void> {
        const query: UploadBody = plainToClass(UploadBody, request.body);
        const result = await validate(query);
        if (result.length) {
            throw result;
        }
        return;
    }
    protected async MainHandlerAsync(request: Request): Promise<void> {
        return this.uow.ExecuteAsync(async (queryRunner) => {
            const buffer = request.file?.buffer as Buffer;
            const ProjectUid = request.body.ProjectUid as string;
            const rawData = await this.uploadService.getRawData(buffer);
            const UnitTypes = await this.yardsRepository.getSubItemUnitTypes(queryRunner);
            let createEntities = await this.uploadService.prepareCreateData(rawData.create, UnitTypes);
            if (createEntities.length) {
                createEntities = await this.subItemRepo.validateSubItemSpecAgainstProject(
                    createEntities,
                    ProjectUid,
                    queryRunner,
                );
                await this.subItemRepo.createRawSubItems(createEntities, queryRunner);
            }
            let updateEntities = await this.uploadService.prepareUpdateData(rawData.update, UnitTypes);
            if (updateEntities.length) {
                updateEntities = await this.subItemRepo.validateSubItemsAgainstProject(
                    updateEntities,
                    ProjectUid,
                    queryRunner,
                );
                await this.subItemRepo.updateMultipleEntities(updateEntities, queryRunner);
            }
            const uids = [...createEntities.map((i) => i.uid), ...updateEntities.map((i) => i.uid)];
            if (uids.length) {
                const condition = `uid IN ('${uids.join(`','`)}')`;
                const vessel = await this.vesselRepository.GetVesselByProjectUid(ProjectUid);
                await SynchronizerService.dataSynchronizeByConditionManager(
                    queryRunner.manager,
                    this.tableName,
                    vessel.VesselId,
                    condition,
                );
            }
        });
    }
}
