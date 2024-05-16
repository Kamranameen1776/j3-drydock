import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { Request } from 'express';

import { ApplicationException, BusinessException } from '../../../bll/drydock/core/exceptions';
import { UploadInvoiceService } from '../../../bll/drydock/yards/upload';
import { ExceptionLogDataDto } from '../../../controllers/drydock/core/middleware/ExceptionLogDataDto';
import { SpecificationDetailsSubItemsRepository } from '../../../dal/drydock/specification-details/sub-items/SpecificationDetailsSubItemsRepository';
import { VesselsRepository } from '../../../dal/drydock/vessels/VesselsRepository';
import { YardsRepository } from '../../../dal/drydock/yards/YardsRepository';
import { log } from '../../../logger';
import { Command } from '../core/cqrs/Command';
import { UnitOfWork } from '../core/uof/UnitOfWork';
import { UploadRequest } from './dtos/InvoiceDto';

export class UploadYardsInvoiceCommand extends Command<Request, boolean> {
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
        if (!request.file || !request.file.buffer || request.file.buffer.length === 0) {
            throw new ApplicationException(
                'The provided Excel file can not be imported: The file is empty. Please check the file and try again.',
            );
        }

        const validationRequest: UploadRequest = { file: request.file, body: request.body };
        const query: UploadRequest = plainToClass(UploadRequest, validationRequest);
        const result = await validate(query);
        if (result.length) {
            throw result;
        }

        return;
    }
    protected async MainHandlerAsync(request: Request): Promise<boolean> {
        try {
            return await this.uploadInvoice(request);
        } catch (error) {
            throw new BusinessException('The file you are about to import is not related to the project.');
        }
    }

    private async uploadInvoice(request: Request): Promise<boolean> {
        return this.uow.ExecuteAsync(async (queryRunner) => {
            const buffer = request.file?.buffer as Buffer;
            const ProjectUid = request.body.ProjectUid as string;
            const rawData = await this.uploadService.getRawData(buffer, ProjectUid);
            const UnitTypes = await this.yardsRepository.getSubItemUnitTypes(queryRunner);
            let createEntities = this.uploadService.prepareCreateData(rawData.create, UnitTypes);
            if (createEntities.length) {
                createEntities = await this.subItemRepo.validateSubItemSpecAgainstProject(
                    createEntities,
                    ProjectUid,
                    queryRunner,
                );
                await this.subItemRepo.createRawSubItems(createEntities, queryRunner);
            }
            let updateEntities = this.uploadService.prepareUpdateData(rawData.update, UnitTypes);
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
                /** TODO: there is some bug appears on demo env. HAVE TO BE FIX before production release.
                await SynchronizerService.dataSynchronizeByConditionManager(
                    queryRunner.manager,
                    this.tableName,
                    vessel.VesselId,
                    condition,
                );
                    */
                //ADDING LOGS TO DEBUG ERROR ABOVE
                const logMessage = JSON.stringify({
                    condition,
                    vessel: JSON.stringify(vessel),
                });
                const logData = new ExceptionLogDataDto();
                logData.Stack = logMessage;
                const method = '/drydock/yards/upload-yard-invoice/';
                const moduleCode = 'project';
                const functionCode = 'invoice';
                const locationId = null;
                const isClient = null;
                await log.warn(logMessage, logData, method, null, moduleCode, functionCode, null, locationId, isClient);
            }

            return !!rawData.hasErrors;
        });
    }
}
