import { Request } from 'express';
import { AccessRights } from 'j2utils';

import { SpecificationDetailsAuditService } from '../../../bll/drydock/standard_jobs/specification-details-audit.service';
import { SpecificationDetailsRepository } from '../../../dal/drydock/specification-details/SpecificationDetailsRepository';
import { Command } from '../core/cqrs/Command';
import { UnitOfWork } from '../core/uof/UnitOfWork';

export class DeleteSpecificationDetailsCommand extends Command<Request, void> {
    specificationDetailsRepository: SpecificationDetailsRepository;
    uow: UnitOfWork;
    specificationDetailsAudit: SpecificationDetailsAuditService;

    constructor() {
        super();

        this.specificationDetailsRepository = new SpecificationDetailsRepository();
        this.uow = new UnitOfWork();
        this.specificationDetailsAudit = new SpecificationDetailsAuditService();
    }

    protected async AuthorizationHandlerAsync(): Promise<void> {
        return;
    }

    protected async ValidationHandlerAsync(request: Request): Promise<void> {
        if (!request.body) {
            throw new Error('Request is null');
        }
    }

    protected async AfterExecution(request: Request): Promise<void> {
        const { UserID: deletedBy } = AccessRights.authorizationDecode(request);
        await this.specificationDetailsAudit.auditDeletedSpecificationDetails(request.body.uid, deletedBy);
    }

    protected async MainHandlerAsync(request: Request) {
        await this.uow.ExecuteAsync(async (queryRunner) => {
            const updatedSpecData = await this.specificationDetailsRepository.DeleteSpecificationDetails(
                request.body.uid,
                queryRunner,
            );
            return updatedSpecData;
        });

        return;
    }
}
