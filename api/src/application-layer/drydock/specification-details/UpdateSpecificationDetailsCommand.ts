import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { Request } from 'express';

import { SpecificationDetailsAuditService } from '../../../bll/drydock/specification-details/specification-details-audit.service';
import { AuthRequest } from '../../../controllers/drydock/core/auth-req.type';
import { SpecificationDetailsRepository } from '../../../dal/drydock/specification-details/SpecificationDetailsRepository';
import { Command } from '../core/cqrs/Command';
import { UnitOfWork } from '../core/uof/UnitOfWork';
import { UpdateSpecificationDetailsDto } from './dtos/UpdateSpecificationDetailsDto';

export class UpdateSpecificationDetailsCommand extends Command<AuthRequest, void> {
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
        const body: UpdateSpecificationDetailsDto = plainToClass(UpdateSpecificationDetailsDto, request.body);
        const result = await validate(body);
        if (result.length) {
            throw result;
        }
        return;
    }

    protected async MainHandlerAsync(request: AuthRequest): Promise<void> {
        await this.uow.ExecuteAsync(async (queryRunner) => {
            const { Inspections } = request.body;
            await this.specificationDetailsRepository.UpdateSpecificationDetails(request.body, queryRunner);
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
            }
            await this.specificationDetailsAudit.auditUpdatedSpecificationDetails(
                request.body,
                request.authUser.UserID,
                queryRunner,
            );
        });

        return;
    }
}
