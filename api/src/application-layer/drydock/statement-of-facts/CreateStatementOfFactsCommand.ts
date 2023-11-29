import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { Request } from 'express';

import { StatementOfFactsRepository } from '../../../dal/drydock/statement-of-facts/StatementOfFactsRepository';
import { Command } from '../core/cqrs/Command';
import { UnitOfWork } from '../core/uof/UnitOfWork';
import { CreateStatementsOfFactsDto } from './dtos/CreateStatementsOfFactsDto';
import {VesselsRepository} from '../../../dal/drydock/vessels/VesselsRepository';
import {SynchronizerService} from 'j2utils';

export class CreateStatementsOfFactsCommand extends Command<Request, void> {
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
        const createProjectDto: CreateStatementsOfFactsDto = plainToClass(CreateStatementsOfFactsDto, request.body);
        const result = await validate(createProjectDto);
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
        const createProjectDto: CreateStatementsOfFactsDto = request.body as CreateStatementsOfFactsDto;

        await this.uow.ExecuteAsync(async (queryRunner) => {
            const uid = await this.repository.CreateStatementOfFacts(createProjectDto, queryRunner);
            const vessel = await this.vesselRepository.GetVesselByProjectUid(createProjectDto.ProjectUid);
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
