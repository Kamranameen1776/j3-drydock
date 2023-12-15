import { validate } from 'class-validator';
import { SynchronizerService } from 'j2utils';

import { getTableName } from '../../../common/drydock/ts-helpers/tableName';
import { StatementOfFactsRepository } from '../../../dal/drydock/statement-of-facts/StatementOfFactsRepository';
import { VesselsRepository } from '../../../dal/drydock/vessels/VesselsRepository';
import { StatementOfFactsEntity } from '../../../entity/drydock';
import { Command } from '../core/cqrs/Command';
import { UnitOfWork } from '../core/uof/UnitOfWork';
import { DeleteStatementOfFactDto } from './dtos/DeleteStatementOfFactDto';

export class DeleteStatementsOfFactsCommand extends Command<DeleteStatementOfFactDto, void> {
    repository: StatementOfFactsRepository;
    uow: UnitOfWork;
    tableName = getTableName(StatementOfFactsEntity);
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

    protected async ValidationHandlerAsync(request: DeleteStatementOfFactDto): Promise<void> {
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
    protected async MainHandlerAsync(request: DeleteStatementOfFactDto): Promise<void> {
        const vessel = await this.vesselRepository.GetVesselByStatementOfFact(request.StatementOfFactUid);

        await this.uow.ExecuteAsync(async (queryRunner) => {
            await this.repository.DeleteStatementOfFacts(request.StatementOfFactUid, queryRunner);

            await SynchronizerService.dataSynchronizeManager(
                queryRunner.manager,
                this.tableName,
                'uid',
                request.StatementOfFactUid,
                vessel.VesselId,
            );
        });
    }
}
