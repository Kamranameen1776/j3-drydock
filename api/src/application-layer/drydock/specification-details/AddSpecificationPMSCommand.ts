import { SpecificationDetailsRepository } from '../../../dal/drydock/specification-details/SpecificationDetailsRepository';
import { Command } from '../core/cqrs/Command';
import { UnitOfWork } from '../core/uof/UnitOfWork';
import { UpdateSpecificationPmsRequestDto } from './dtos/UpdateSpecificationPMSRequestDto';

export class AddSpecificationPmsCommand extends Command<UpdateSpecificationPmsRequestDto, void> {
    specificationDetailsRepository = new SpecificationDetailsRepository();
    uow = new UnitOfWork();

    protected async MainHandlerAsync(request: UpdateSpecificationPmsRequestDto) {
        const data = request.body.PmsIds.map((PMSUid) => {
            return {
                SpecificationUid: request.body.uid,
                PMSUid,
            };
        });
        await this.uow.ExecuteAsync(async (queryRunner) => {
            return this.specificationDetailsRepository.addSpecificationPms(data, queryRunner);
        });
    }
}
