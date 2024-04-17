import { validate } from 'class-validator';
import { SynchronizerService } from 'j2utils';

import { ApplicationException } from '../../../bll/drydock/core/exceptions';
import { SpecificationDetailsAuditService } from '../../../bll/drydock/specification-details/specification-details-audit.service';
import { getTableName } from '../../../common/drydock/ts-helpers/tableName';
import { SpecificationDetailsRepository } from '../../../dal/drydock/specification-details/SpecificationDetailsRepository';
import { VesselsRepository } from '../../../dal/drydock/vessels/VesselsRepository';
import { SpecificationDetailsEntity, SpecificationInspectionEntity } from '../../../entity/drydock';
import { J2FieldsHistoryEntity } from '../../../entity/drydock/dbo/J2FieldsHistoryEntity';
import { QueryStrings } from '../../../shared/enum/queryStrings.enum';
import { Command } from '../core/cqrs/Command';
import { UnitOfWork } from '../core/uof/UnitOfWork';
import { UpdateSpecificationDetailsDto } from './dtos/UpdateSpecificationDetailsDto';

export class UpdateSpecificationDetailsCommand extends Command<UpdateSpecificationDetailsDto, void> {
    specificationDetailsRepository: SpecificationDetailsRepository;
    uow: UnitOfWork;
    specificationDetailsAudit: SpecificationDetailsAuditService;
    vesselsRepository: VesselsRepository;
    tableName = getTableName(SpecificationDetailsEntity);
    tableNameInspections = getTableName(SpecificationInspectionEntity);
    tableNameAudit = getTableName(J2FieldsHistoryEntity);

    constructor() {
        super();
        this.vesselsRepository = new VesselsRepository();
        this.specificationDetailsRepository = new SpecificationDetailsRepository();
        this.uow = new UnitOfWork();
        this.specificationDetailsAudit = new SpecificationDetailsAuditService();
    }

    protected async AuthorizationHandlerAsync(): Promise<void> {
        return;
    }

    protected async ValidationHandlerAsync(request: UpdateSpecificationDetailsDto): Promise<void> {
        const result = await validate(request);
        if (result.length) {
            throw result;
        }
        return;
    }

    protected async MainHandlerAsync(request: UpdateSpecificationDetailsDto): Promise<void> {
        // This requires strict logic on frontend to prevent this from happening
        // Now on frontend we do saving of changes to specification and moving status to completed at the same time
        // But with this change it's required to be done in two steps
        // First save changes to specification and then move status to completed
        // With moving to the closed status we should do it vice versa
        // First move status to closed and then save changes to specification
        if (await this.specificationDetailsRepository.isSpecificationIsCompleted(request.uid)) {
            throw new ApplicationException('Specification is completed, cannot be updated');
        }

        const vessel = await this.vesselsRepository.GetVesselBySpecification(request.uid);
        await this.uow.ExecuteAsync(async (queryRunner) => {
            const entity = new SpecificationDetailsEntity();
            entity.uid = request.uid;
            entity.Subject = request.Subject ?? '';
            entity.AccountCode = request.AccountCode;
            entity.DoneByUid = request.DoneByUid;
            entity.Description = request.Description ?? '';
            entity.PriorityUid = request.PriorityUid;
            entity.Duration = request.Duration ?? 0;
            entity.StartDate = request.StartDate ?? null;
            entity.EndDate = request.EndDate ?? null;
            entity.Completion = request.Completion ?? 0;
            entity.EstimatedBudget = request.EstimatedBudget ?? 0;
            entity.EstimatedDays = request.EstimatedDays ?? 0;
            entity.JobExecutionUid = request.JobExecutionUid!;
            entity.EstimatedCost = request.EstimatedCost ?? 0;
            entity.BufferTime = request.BufferTime ?? 0;
            entity.GlAccountUid = request.GlAccountUid!;
            entity.JobRequired = request.JobRequired || QueryStrings.Yes;

            await this.specificationDetailsRepository.UpdateSpecificationDetailsByEntity(entity, queryRunner);

            await this.specificationDetailsRepository.updateEstimatedCost(entity.uid, queryRunner);

            await SynchronizerService.dataSynchronizeManager(
                queryRunner.manager,
                this.tableName,
                'uid',
                request.uid,
                vessel.VesselId,
            );
            if (request.Inspections !== undefined) {
                const data = request.Inspections.map((item: number) => {
                    return {
                        LIBSurveyCertificateAuthorityID: item,
                        SpecificationDetailsUid: request.uid,
                    };
                });

                await this.specificationDetailsRepository.UpdateSpecificationInspection(data, request.uid, queryRunner);

                const condition = `specification_details_uid = '${request.uid}'`;

                await SynchronizerService.dataSynchronizeByConditionManager(
                    queryRunner.manager,
                    this.tableNameInspections,
                    vessel.VesselId,
                    condition,
                );
            }

            const ids = await this.specificationDetailsAudit.auditUpdatedSpecificationDetails(
                request,
                request.UserId,
                queryRunner,
            );

            const condition = `uid IN ('${ids.join(`','`)}')`;

            await SynchronizerService.dataSynchronizeByConditionManager(
                queryRunner.manager,
                this.tableNameAudit,
                vessel.VesselId,
                condition,
            );
        });

        return;
    }
}
