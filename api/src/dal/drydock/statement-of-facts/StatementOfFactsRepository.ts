import { Request } from 'express';
import { DataUtilService, ODataService } from 'j2utils';
import { ODataResult } from 'shared/interfaces';
import { getConnection, getManager, QueryRunner } from 'typeorm';

import { CreateStatementsOfFactsDto } from '../../../application-layer/drydock/statement-of-facts/dtos/CreateStatementsOfFactsDto';
import { UpdateStatementOfFactsDto } from '../../../application-layer/drydock/statement-of-facts/dtos/UpdateStatementOfFactsDto';
import { StatementOfFactsEntity } from '../../../entity/drydock';

export class StatementOfFactsRepository {
    public async CreateStatementOfFacts(data: CreateStatementsOfFactsDto, queryRunner: QueryRunner): Promise<string> {
        const sof = new StatementOfFactsEntity();
        sof.DateAndTime = data.DateAndTime;
        sof.Fact = data.Fact;
        sof.ProjectUid = data.ProjectUid;
        sof.uid = DataUtilService.newUid();

        await queryRunner.manager.insert(StatementOfFactsEntity, sof);
        return sof.uid;
    }

    public async DeleteStatementOfFacts(uid: string, queryRunner: QueryRunner): Promise<void> {
        const sof = new StatementOfFactsEntity();
        sof.uid = uid;
        sof.ActiveStatus = false;

        await queryRunner.manager.update(StatementOfFactsEntity, sof.uid, sof);
    }

    public async UpdateStatementOfFacts(data: UpdateStatementOfFactsDto, queryRunner: QueryRunner): Promise<void> {
        await queryRunner.manager.update(StatementOfFactsEntity, data.uid, data);
    }

    public async GetStatementOfFacts(request: Request): Promise<ODataResult<StatementOfFactsEntity>> {
        const projectRepository = getManager().getRepository(StatementOfFactsEntity);
        const query = projectRepository
            .createQueryBuilder('sof')
            .select(['sof.uid AS uid', 'sof.Fact AS Fact', 'cast(sof.DateAndTime as datetimeoffset) AS DateAndTime'])
            .where('sof.ActiveStatus = 1');

        const oDataService = new ODataService(request, getConnection);

        return oDataService.getJoinResult(query.getQuery());
    }
}
