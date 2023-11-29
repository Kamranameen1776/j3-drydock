import { SpecificationDetailsRepository } from '../../../../dal/drydock/specification-details/SpecificationDetailsRepository';
import { Command } from '../../core/cqrs/Command';
import { UnitOfWork } from '../../core/uof/UnitOfWork';
import { UpdateSpecificationPmsRequestDto } from '../dtos/UpdateSpecificationPMSRequestDto';

export class DeleteSpecificationPmsCommand extends Command<UpdateSpecificationPmsRequestDto, void> {
    specificationDetailsRepository = new SpecificationDetailsRepository();
    uow = new UnitOfWork();

    protected async MainHandlerAsync(request: UpdateSpecificationPmsRequestDto) {
        await this.uow.ExecuteAsync(async (queryRunner) => {
            return this.specificationDetailsRepository.deleteSpecificationPms(request.body, queryRunner);
        });
    }
}
