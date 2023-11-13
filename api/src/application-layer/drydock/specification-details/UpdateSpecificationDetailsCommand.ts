import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { Request } from 'express';

import { SpecificationDetailsRepository } from '../../../dal/drydock/specification-details/SpecificationDetailsRepository';
import { Command } from '../core/cqrs/Command';
import { UnitOfWork } from '../core/uof/UnitOfWork';
import { UpdateSpecificationDetailsDto } from './dtos/UpdateSpecificationDetailsDto';

export class UpdateSpecificationDetailsCommand extends Command<Request, void> {
    specificationDetailsRepository: SpecificationDetailsRepository;
    uow: UnitOfWork;

    constructor() {
        super();

        this.specificationDetailsRepository = new SpecificationDetailsRepository();
        this.uow = new UnitOfWork();
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

    protected async MainHandlerAsync(request: Request): Promise<void> {
        await this.uow.ExecuteAsync(async (queryRunner) => {
            const { Inspections } = request.body;
            const updatedSpecData = await this.specificationDetailsRepository.UpdateSpecificationDetails(
                request.body,
                queryRunner,
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
            }
        });

        return;
    }
}
