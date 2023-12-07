import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { SynchronizerService } from 'j2utils';

import { SpecificationDetailsAuditService } from '../../../bll/drydock/specification-details/specification-details-audit.service';
import { getTableName } from '../../../common/drydock/ts-helpers/tableName';
import { SpecificationDetailsRepository } from '../../../dal/drydock/specification-details/SpecificationDetailsRepository';
import { VesselsRepository } from '../../../dal/drydock/vessels/VesselsRepository';
import { SpecificationDetailsEntity, SpecificationInspectionEntity } from '../../../entity/drydock';
import { J2FieldsHistoryEntity } from '../../../entity/drydock/dbo/J2FieldsHistoryEntity';
import { Command } from '../core/cqrs/Command';
import { CommandRequest } from '../core/cqrs/CommandRequestDto';
import { UnitOfWork } from '../core/uof/UnitOfWork';
import { UpdateSpecificationDetailsDto } from './dtos/UpdateSpecificationDetailsDto';

export class UpdateSpecificationDetailsCommand extends Command<CommandRequest, void> {
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

    protected async ValidationHandlerAsync({ request }: CommandRequest): Promise<void> {
        const body: UpdateSpecificationDetailsDto = plainToClass(UpdateSpecificationDetailsDto, request.body);
        const result = await validate(body);
        if (result.length) {
            throw result;
        }
        return;
    }

    protected async MainHandlerAsync({ request, user }: CommandRequest): Promise<void> {
        const vessel = await this.vesselsRepository.GetVesselBySpecification(request.body.uid);
        await this.uow.ExecuteAsync(async (queryRunner) => {
            const { Inspections } = request.body;
            await this.specificationDetailsRepository.UpdateSpecificationDetails(request.body, queryRunner);
            await SynchronizerService.dataSynchronizeManager(
                queryRunner.manager,
                this.tableName,
                'uid',
                request.body.uid,
                vessel.VesselId,
            );
            if (Inspections !== undefined) {
                const data = Inspections.map((item: number) => {
                    return {
                        LIBSurveyCertificateAuthorityID: item,
                        SpecificationDetailsUid: request.body.uid,
                    };
                });
                await this.specificationDetailsRepository.UpdateSpecificationInspection(
                    data,
                    request.body.uid,
                    queryRunner,
                );
                const condition = `specification_details_uid = '${request.body.uid}'`;
                await SynchronizerService.dataSynchronizeByConditionManager(
                    queryRunner.manager,
                    this.tableNameInspections,
                    vessel.VesselId,
                    condition,
                );
            }
            const ids = await this.specificationDetailsAudit.auditUpdatedSpecificationDetails(
                request.body,
                user.UserID,
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
