import { Request } from 'express';

import { SpecificationDetailsAuditService } from '../../../bll/drydock/specification-details/specification-details-audit.service';
import { AuthRequest } from '../../../controllers/drydock/core/auth-req.type';
import { SpecificationDetailsRepository } from '../../../dal/drydock/specification-details/SpecificationDetailsRepository';
import { Command } from '../core/cqrs/Command';
import { UserFromToken } from '../core/cqrs/UserDto';
import { UnitOfWork } from '../core/uof/UnitOfWork';

export class DeleteSpecificationDetailsCommand extends Command<AuthRequest, void> {
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

    protected async MainHandlerAsync(request: AuthRequest) {
        await this.uow.ExecuteAsync(async (queryRunner) => {
            const updatedSpecData = await this.specificationDetailsRepository.DeleteSpecificationDetails(
                request.body.uid,
                queryRunner,
            );
            await this.specificationDetailsAudit.auditDeletedSpecificationDetails(
                request.body.uid,
                request.authUser.UserID,
                queryRunner,
            );
            return updatedSpecData;
        });

        return;
    }
}
