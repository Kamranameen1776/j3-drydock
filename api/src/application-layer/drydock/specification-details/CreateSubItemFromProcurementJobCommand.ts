import { SpecificationDetailsRepository } from '../../../dal/drydock/specification-details/SpecificationDetailsRepository';
import { Command } from '../core/cqrs/Command';
import { UnitOfWork } from '../core/uof/UnitOfWork';
import { UpdateSpecificationSubItemRequestDto } from './dtos/UpdateSpecificationSubItemRequestDto';

export class CreateSubItemFromProcurementJobCommand extends Command<UpdateSpecificationSubItemRequestDto, void> {
    constructor() {
        super();
    }

    protected async MainHandlerAsync(request: UpdateSpecificationSubItemRequestDto): Promise<void> {
        try {
            await new UnitOfWork().ExecuteAsync(async (queryRunner) => {
                new SpecificationDetailsRepository().addSpecificationSubItemFromPrcJob(
                    request.headers.authorization as string,
                    request.body,
                    queryRunner,
                );
            });
        } catch (error) {
            console.log({
                error,
            });
        }
        throw new Error('Method not implemented.');
    }
}
