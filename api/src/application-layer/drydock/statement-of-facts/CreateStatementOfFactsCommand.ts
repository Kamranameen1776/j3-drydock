import { validate } from 'class-validator';
import { SynchronizerService } from 'j2utils';

import { getTableName } from '../../../common/drydock/ts-helpers/tableName';
import { CreateStatementsOfFactsDto } from '../../../dal/drydock/statement-of-facts/CreateStatementsOfFactsDto';
import { StatementOfFactsRepository } from '../../../dal/drydock/statement-of-facts/StatementOfFactsRepository';
import { VesselsRepository } from '../../../dal/drydock/vessels/VesselsRepository';
import { StatementOfFactsEntity } from '../../../entity/drydock';
import { Command } from '../core/cqrs/Command';
import { UnitOfWork } from '../core/uof/UnitOfWork';

export class CreateStatementsOfFactsCommand extends Command<CreateStatementsOfFactsDto, void> {
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

    protected async ValidationHandlerAsync(request: CreateStatementsOfFactsDto): Promise<void> {
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
    protected async MainHandlerAsync(request: CreateStatementsOfFactsDto): Promise<void> {
        const vessel = await this.vesselRepository.GetVesselByProjectUid(request.ProjectUid);

        await this.uow.ExecuteAsync(async (queryRunner) => {
            const uid = await this.repository.CreateStatementOfFacts(request, queryRunner);

            await SynchronizerService.dataSynchronizeManager(
                queryRunner.manager,
                this.tableName,
                'uid',
                uid,
                vessel.VesselId,
            );
        });
    }
}
