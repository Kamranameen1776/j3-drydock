import { validate } from 'class-validator';
import { SynchronizerService } from 'j2utils';

import { SpecificationDetailsAuditService } from '../../../bll/drydock/specification-details/specification-details-audit.service';
import { getTableName } from '../../../common/drydock/ts-helpers/tableName';
import { IUpdateSpecificationDetailsDto } from '../../../dal/drydock/specification-details/dtos';
import { SpecificationDetailsRepository } from '../../../dal/drydock/specification-details/SpecificationDetailsRepository';
import { VesselsRepository } from '../../../dal/drydock/vessels/VesselsRepository';
import { SpecificationDetailsEntity, SpecificationInspectionEntity } from '../../../entity/drydock';
import { J2FieldsHistoryEntity } from '../../../entity/drydock/dbo/J2FieldsHistoryEntity';
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
        const vessel = await this.vesselsRepository.GetVesselBySpecification(request.uid);
        await this.uow.ExecuteAsync(async (queryRunner) => {
            const dto: IUpdateSpecificationDetailsDto = {
                uid: request.uid,
                Subject: request.Subject,
                AccountCode: request.AccountCode,
                DoneByUid: request.DoneByUid,
                Description: request.Description,
                PriorityUid: request.PriorityUid,
            };

            await this.specificationDetailsRepository.UpdateSpecificationDetails(dto, queryRunner);

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
