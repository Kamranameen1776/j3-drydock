import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { Request } from 'express';
import { SynchronizerService } from 'j2utils';

import { StatementOfFactsRepository } from '../../../dal/drydock/statement-of-facts/StatementOfFactsRepository';
import { VesselsRepository } from '../../../dal/drydock/vessels/VesselsRepository';
import { Command } from '../core/cqrs/Command';
import { UnitOfWork } from '../core/uof/UnitOfWork';
import { UpdateStatementOfFactsDto } from './dtos/UpdateStatementOfFactsDto';

export class UpdateStatementOfFactsCommand extends Command<Request, void> {
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
        const updateStatementOfFacts: UpdateStatementOfFactsDto = plainToClass(UpdateStatementOfFactsDto, request.body);
        const result = await validate(updateStatementOfFacts);
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
        const updateStatementOfFactsDto: UpdateStatementOfFactsDto = request.body as UpdateStatementOfFactsDto;
        const { uid } = updateStatementOfFactsDto;
        const vessel = await this.vesselRepository.GetVesselByStatementOfFact(uid);

        await this.uow.ExecuteAsync(async (queryRunner) => {
            await this.repository.UpdateStatementOfFacts(updateStatementOfFactsDto, queryRunner);
            await SynchronizerService.dataSynchronizeManager(
                queryRunner.manager,
                this.tableName,
                'uid',
                uid,
                vessel.VesselId,
            );
            return;
        });

        return;
    }
}
