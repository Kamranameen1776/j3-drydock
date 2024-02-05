import { SynchronizerService } from 'j2utils';

import { SpecificationDetailsAuditService } from '../../../bll/drydock/specification-details/specification-details-audit.service';
import { getTableName } from '../../../common/drydock/ts-helpers/tableName';
import { SpecificationDetailsRepository } from '../../../dal/drydock/specification-details/SpecificationDetailsRepository';
import { VesselsRepository } from '../../../dal/drydock/vessels/VesselsRepository';
import { SpecificationDetailsEntity } from '../../../entity/drydock';
import { J2FieldsHistoryEntity } from '../../../entity/drydock/dbo/J2FieldsHistoryEntity';
import { TaskManagerService } from '../../../external-services/drydock/TaskManager';
import { Command } from '../core/cqrs/Command';
import { UnitOfWork } from '../core/uof/UnitOfWork';
import { DeleteSpecificationDetailsDto } from './dtos/DeleteSpecificationDetailsDto';

export class DeleteSpecificationDetailsCommand extends Command<DeleteSpecificationDetailsDto, void> {
    specificationDetailsRepository: SpecificationDetailsRepository;
    uow: UnitOfWork;
    specificationDetailsAudit: SpecificationDetailsAuditService;
    tableName = getTableName(SpecificationDetailsEntity);
    vesselsRepository: VesselsRepository;
    tableNameAudit = getTableName(J2FieldsHistoryEntity);
    taskManagerService: TaskManagerService;

    constructor() {
        super();

        this.specificationDetailsRepository = new SpecificationDetailsRepository();
        this.uow = new UnitOfWork();
        this.specificationDetailsAudit = new SpecificationDetailsAuditService();
        this.vesselsRepository = new VesselsRepository();
        this.taskManagerService = new TaskManagerService();
    }

    protected async AuthorizationHandlerAsync(): Promise<void> {
        return;
    }

    protected async ValidationHandlerAsync(request: DeleteSpecificationDetailsDto): Promise<void> {
        if (!request) {
            throw new Error('Request is null');
        }
    }

    protected async MainHandlerAsync(request: DeleteSpecificationDetailsDto) {
        const specificationDetail = await this.specificationDetailsRepository.getRawSpecificationByUid(request.uid);
        await this.taskManagerService.DeleteTaskManagerIntegration(
            specificationDetail.TecTaskManagerUid,
            request.token,
        );
        await this.uow.ExecuteAsync(async (queryRunner) => {
            const vessel = await this.vesselsRepository.GetVesselBySpecification(request.uid, queryRunner);

            const updatedSpecData = await this.specificationDetailsRepository.DeleteSpecificationDetails(
                request.uid,
                queryRunner,
            );
            await SynchronizerService.dataSynchronizeManager(
                queryRunner.manager,
                this.tableName,
                'uid',
                request.uid,
                vessel.VesselId,
            );
            const id = await this.specificationDetailsAudit.auditDeletedSpecificationDetails(
                request.uid,
                request.UserId,
                queryRunner,
            );
            await SynchronizerService.dataSynchronizeManager(
                queryRunner.manager,
                this.tableNameAudit,
                'uid',
                id,
                vessel.VesselId,
            );
            return updatedSpecData;
        });

        return;
    }
}
