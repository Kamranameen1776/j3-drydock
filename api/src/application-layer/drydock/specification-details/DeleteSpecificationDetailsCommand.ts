import { SynchronizerService } from 'j2utils';

import { SpecificationDetailsAuditService } from '../../../bll/drydock/specification-details/specification-details-audit.service';
import { getTableName } from '../../../common/drydock/ts-helpers/tableName';
import { SpecificationDetailsRepository } from '../../../dal/drydock/specification-details/SpecificationDetailsRepository';
import { VesselsRepository } from '../../../dal/drydock/vessels/VesselsRepository';
import { SpecificationDetailsEntity } from '../../../entity/drydock';
import { J2FieldsHistoryEntity } from '../../../entity/drydock/dbo/J2FieldsHistoryEntity';
import { TaskManagerService } from '../../../external-services/drydock/TaskManager';
import { Command } from '../core/cqrs/Command';
import { CommandRequest } from '../core/cqrs/CommandRequestDto';
import { UnitOfWork } from '../core/uof/UnitOfWork';

export class DeleteSpecificationDetailsCommand extends Command<CommandRequest, void> {
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

    protected async ValidationHandlerAsync({ request }: CommandRequest): Promise<void> {
        if (!request.body) {
            throw new Error('Request is null');
        }
    }

    protected async MainHandlerAsync({ request, user }: CommandRequest) {
        const specificationDetail = await this.specificationDetailsRepository.getRawSpecificationByUid(
            request.body.uid,
        );
        await this.taskManagerService.DeleteTaskManagerIntegration(
            specificationDetail.TecTaskManagerUid,
            request.headers.authorization as string,
        );
        await this.uow.ExecuteAsync(async (queryRunner) => {
            const vessel = await this.vesselsRepository.GetVesselBySpecification(request.body.uid, queryRunner);

            const { uid } = request.body;
            const updatedSpecData = await this.specificationDetailsRepository.DeleteSpecificationDetails(
                uid,
                queryRunner,
            );
            await SynchronizerService.dataSynchronizeManager(
                queryRunner.manager,
                this.tableName,
                'uid',
                uid,
                vessel.VesselId,
            );
            const id = await this.specificationDetailsAudit.auditDeletedSpecificationDetails(
                uid,
                user.UserID,
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
