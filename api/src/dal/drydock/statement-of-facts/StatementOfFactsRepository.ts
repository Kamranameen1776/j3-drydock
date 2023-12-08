import { Request } from 'express';
import { DataUtilService, ODataService } from 'j2utils';
import { getConnection, getManager, QueryRunner } from 'typeorm';

import { StatementOfFactsEntity } from '../../../entity/drydock/StatementOfFactsEntity';
import { ODataResult } from '../../../shared/interfaces/odata-result.interface';
import { CreateStatementsOfFactsDto } from './CreateStatementsOfFactsDto';
import { IStatementOfFactsDto } from './IStatementOfFactsDto';
import { UpdateStatementOfFactsDto } from './UpdateStatementOfFactsDto';

export class StatementOfFactsRepository {
    public async CreateStatementOfFacts(data: CreateStatementsOfFactsDto, queryRunner: QueryRunner): Promise<string> {
        const sof = new StatementOfFactsEntity();
        sof.uid = new DataUtilService().newUid();
        sof.DateAndTime = data.DateTime;
        sof.Fact = data.Fact;
        sof.ProjectUid = data.ProjectUid;

        await queryRunner.manager.save(sof);

        return sof.uid;
    }

    public async DeleteStatementOfFacts(statementOfFactUid: string, queryRunner: QueryRunner): Promise<void> {
        const sof = new StatementOfFactsEntity();
        sof.uid = statementOfFactUid;
        sof.ActiveStatus = false;

        await queryRunner.manager.update(StatementOfFactsEntity, sof.uid, sof);
    }

    public async UpdateStatementOfFacts(data: UpdateStatementOfFactsDto, queryRunner: QueryRunner): Promise<void> {
        const sof = new StatementOfFactsEntity();
        sof.DateAndTime = data.DateTime;
        sof.Fact = data.Fact;

        await queryRunner.manager.update(StatementOfFactsEntity, data.StatementOfFactUid, sof);
    }

    public async GetStatementOfFacts(request: Request): Promise<ODataResult<IStatementOfFactsDto>> {
        const projectRepository = getManager().getRepository(StatementOfFactsEntity);

        const query: string = projectRepository
            .createQueryBuilder('sof')
            .select([
                'sof.ProjectUid AS ProjectUid',
                'sof.uid AS StatementOfFactsUid',
                'sof.Fact AS Fact',
                'cast(sof.DateAndTime as datetimeoffset) AS DateAndTime',
            ])
            .where('sof.ActiveStatus = 1')
            .getQuery();

        const oDataService = new ODataService(request, getConnection);

        return oDataService.getJoinResult(query);
    }
}
