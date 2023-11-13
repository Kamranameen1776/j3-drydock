import { SpecificationDetailsRepository } from '../../../dal/drydock/specification-details/SpecificationDetailsRepository';
import { Command } from "../core/cqrs/Command";
import { Request } from "express";
import { UnitOfWork } from "../core/uof/UnitOfWork";
import { DeleteSpecificationRequisitionsRequestDto } from "./dtos/DeleteSpecificationRequisitionsRequestDto";

export class DeleteSpecificationRequisitionCommand extends Command<Request, void> {
    specificationDetailsRepository = new SpecificationDetailsRepository();
    uow = new UnitOfWork();

    protected async MainHandlerAsync(request: Request)  {
        const body: DeleteSpecificationRequisitionsRequestDto = request.body;
        return this.uow.ExecuteAsync(async (queryRunner) => {
            return this.specificationDetailsRepository.deleteSpecificationRequisitions(body, queryRunner);
        });
    }
}
