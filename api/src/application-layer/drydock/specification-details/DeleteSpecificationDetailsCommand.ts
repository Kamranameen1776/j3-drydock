import { SynchronizerService } from 'j2utils';

import { SpecificationDetailsAuditService } from '../../../bll/drydock/specification-details/specification-details-audit.service';
import { SpecificationDetailsRepository } from '../../../dal/drydock/specification-details/SpecificationDetailsRepository';
import { VesselsRepository } from '../../../dal/drydock/vessels/VesselsRepository';
import { Command } from '../core/cqrs/Command';
import { CommandRequest } from '../core/cqrs/CommandRequestDto';
import { UnitOfWork } from '../core/uof/UnitOfWork';

export class DeleteSpecificationDetailsCommand extends Command<CommandRequest, void> {
    specificationDetailsRepository: SpecificationDetailsRepository;
    uow: UnitOfWork;
    specificationDetailsAudit: SpecificationDetailsAuditService;
    tableName: 'dry_dock.specification_details';
    vesselsRepository: VesselsRepository;
    constructor() {
        super();

        this.specificationDetailsRepository = new SpecificationDetailsRepository();
        this.uow = new UnitOfWork();
        this.specificationDetailsAudit = new SpecificationDetailsAuditService();
        this.vesselsRepository = new VesselsRepository();
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
        await this.uow.ExecuteAsync(async (queryRunner) => {
            const { uid } = request.body;
            const updatedSpecData = await this.specificationDetailsRepository.DeleteSpecificationDetails(
                uid,
                queryRunner,
            );
            const vessel = await this.vesselsRepository.GetVesselBySpecification(uid);
            await SynchronizerService.dataSynchronizeManager(
                queryRunner.manager,
                this.tableName,
                'uid',
                uid,
                vessel.VesselId,
            );
            await this.specificationDetailsAudit.auditDeletedSpecificationDetails(uid, user.UserID, queryRunner);
            return updatedSpecData;
        });

        return;
    }
}
