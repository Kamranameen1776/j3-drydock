import { SpecificationDetailsRepository } from '../../../dal/drydock/specification-details/SpecificationDetailsRepository';
import { Command } from '../core/cqrs/Command';
import { Request } from 'express';
import { LinkSpecificationRequisitionsRequestDto } from './dtos/LinkSpecificationRequisitionsRequestDto';
import { UnitOfWork } from '../core/uof/UnitOfWork';
import { SpecificationRequisitionsEntity } from '../../../entity/SpecificationRequisitionsEntity';

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
