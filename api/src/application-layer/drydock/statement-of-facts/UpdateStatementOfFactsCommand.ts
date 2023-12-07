import { validate } from 'class-validator';
import { SynchronizerService } from 'j2utils';

import { StatementOfFactsRepository } from '../../../dal/drydock/statement-of-facts/StatementOfFactsRepository';
import { UpdateStatementOfFactsDto } from '../../../dal/drydock/statement-of-facts/UpdateStatementOfFactsDto';
import { VesselsRepository } from '../../../dal/drydock/vessels/VesselsRepository';
import { Command } from '../core/cqrs/Command';
import { UnitOfWork } from '../core/uof/UnitOfWork';

export class UpdateStatementOfFactsCommand extends Command<UpdateStatementOfFactsDto, void> {
    repository: StatementOfFactsRepository;
    uow: UnitOfWork;
    tableName = 'dry_dock.statement_of_facts';
    vesselRepository: VesselsRepository;

    constructor() {
        super();
        this.repository = new StatementOfFactsRepository();
        this.uow = new UnitOfWork();
        this.vesselRepository = new VesselsRepository();
    }

    protected async AuthorizationHandlerAsync(): Promise<void> {
        return;
    }

    protected async ValidationHandlerAsync(request: UpdateStatementOfFactsDto): Promise<void> {
        if (!request) {
            throw new Error('Request is null');
        }
        const result = await validate(request);
        if (result.length) {
            throw result;
        }
    }

    /**
     *
     * @param request Project data for creation of the new project
     * @returns New created project result
     */
    protected async MainHandlerAsync(request: UpdateStatementOfFactsDto): Promise<void> {
        const vessel = await this.vesselRepository.GetVesselByStatementOfFact(request.StatementOfFactUid);

        await this.uow.ExecuteAsync(async (queryRunner) => {
            await this.repository.UpdateStatementOfFacts(request, queryRunner);
            await this.repository.UpdateStatementOfFacts(request, queryRunner);

            await SynchronizerService.dataSynchronizeManager(
                queryRunner.manager,
                this.tableName,
                'uid',
                request.StatementOfFactUid,
                vessel.VesselId,
            );
            return;
        });
    }
}
