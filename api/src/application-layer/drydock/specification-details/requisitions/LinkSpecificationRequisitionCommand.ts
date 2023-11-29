import { Request } from 'express';

import { SpecificationDetailsRepository } from '../../../../dal/drydock/specification-details/SpecificationDetailsRepository';
import { SpecificationRequisitionsEntity } from '../../../../entity/drydock';
import { Command } from '../../core/cqrs/Command';
import { UnitOfWork } from '../../core/uof/UnitOfWork';
import { LinkSpecificationRequisitionsRequestDto } from '../dtos/LinkSpecificationRequisitionsRequestDto';

export class LinkSpecificationRequisitionCommand extends Command<Request, SpecificationRequisitionsEntity[]> {
    specificationDetailsRepository = new SpecificationDetailsRepository();
    uow = new UnitOfWork();

    protected async MainHandlerAsync(request: Request) {
        const body: LinkSpecificationRequisitionsRequestDto = request.body;
        return this.uow.ExecuteAsync(async (queryRunner) => {
            return this.specificationDetailsRepository.linkSpecificationRequisitions(body, queryRunner);
        });
    }
}
