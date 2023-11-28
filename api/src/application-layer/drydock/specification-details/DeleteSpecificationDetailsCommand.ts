import { SpecificationDetailsAuditService } from '../../../bll/drydock/specification-details/specification-details-audit.service';
import { SpecificationDetailsRepository } from '../../../dal/drydock/specification-details/SpecificationDetailsRepository';
import { Command } from '../core/cqrs/Command';
import { CommandRequest } from '../core/cqrs/CommandRequestDto';
import { UnitOfWork } from '../core/uof/UnitOfWork';

export class DeleteSpecificationDetailsCommand extends Command<CommandRequest, void> {
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

    protected async ValidationHandlerAsync({ request }: CommandRequest): Promise<void> {
        if (!request.body) {
            throw new Error('Request is null');
        }
    }

    protected async MainHandlerAsync({ request, user }: CommandRequest) {
        await this.uow.ExecuteAsync(async (queryRunner) => {
            const updatedSpecData = await this.specificationDetailsRepository.DeleteSpecificationDetails(
                request.body.uid,
                queryRunner,
            );
            await this.specificationDetailsAudit.auditDeletedSpecificationDetails(
                request.body.uid,
                user.UserID,
                queryRunner,
            );
            return updatedSpecData;
        });

        return;
    }
}
