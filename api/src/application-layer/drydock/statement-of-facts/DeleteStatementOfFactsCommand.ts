import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { Request } from 'express';
import { SynchronizerService } from 'j2utils';

import { StatementOfFactsRepository } from '../../../dal/drydock/statement-of-facts/StatementOfFactsRepository';
import { VesselsRepository } from '../../../dal/drydock/vessels/VesselsRepository';
import { Command } from '../core/cqrs/Command';
import { UnitOfWork } from '../core/uof/UnitOfWork';
import { DeleteStatementOfFactDto } from './dtos/DeleteStatementOfFactDto';

export class DeleteStatementsOfFactsCommand extends Command<Request, void> {
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

    protected async ValidationHandlerAsync(request: Request): Promise<void> {
        if (!request) {
            throw new Error('Request is null');
        }
        const deleteStatementOfFacts: DeleteStatementOfFactDto = plainToClass(DeleteStatementOfFactDto, request.body);
        const result = await validate(deleteStatementOfFacts);
        if (result.length) {
            throw result;
        }
    }

    /**
     *
     * @param request Project data for creation of the new project
     * @returns New created project result
     */
    protected async MainHandlerAsync(request: Request): Promise<void> {
        const deleteStatementOfFactsDto: DeleteStatementOfFactDto = request.body as DeleteStatementOfFactDto;
        const { StatementOfFactUid } = deleteStatementOfFactsDto;
        const vessel = await this.vesselRepository.GetVesselByStatementOfFact(StatementOfFactUid);

        await this.uow.ExecuteAsync(async (queryRunner) => {
            await this.repository.DeleteStatementOfFacts(StatementOfFactUid, queryRunner);
            await SynchronizerService.dataSynchronizeManager(
                queryRunner.manager,
                this.tableName,
                'uid',
                StatementOfFactUid,
                vessel.VesselId,
            );
            return;
        });

        return;
    }
}
