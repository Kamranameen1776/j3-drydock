import { QueryRunner } from 'typeorm';

import { J2FieldsHistoryEntity } from '../../../entity/drydock/dbo/J2FieldsHistoryEntity';

export type CreateFieldsHistoryDto = {
    key1: string;
    key2: string;
    key3: string;
    uid: string;
    moduleCode: string;
    functionCode: string;
    isCurrent: boolean;
    versionNumber: number;
    tableName: string;
    section: string;
    displayText: string;
    value: string;
    actionName: string;
    createdDate: Date;
    createdBy: string;
};

export class FieldsHistoryRepository {
    public async saveFieldsHistory(fieldsHistory: CreateFieldsHistoryDto, queryRunner: QueryRunner): Promise<void> {
        await this.insertQuery(fieldsHistory, queryRunner);
    }

    public async insertMany(fieldsHistories: CreateFieldsHistoryDto[], queryRunner: QueryRunner): Promise<void> {
        await this.insertManyQuery(fieldsHistories, queryRunner);
    }

    private async insertQuery(fieldsHistory: CreateFieldsHistoryDto, queryRunner: QueryRunner): Promise<void> {
        // Create the query builder for the insert operation
        const queryBuilder = queryRunner.manager.createQueryBuilder().insert().into(J2FieldsHistoryEntity).values({
            key1: fieldsHistory.key1,
            key2: fieldsHistory.key2,
            key3: fieldsHistory.key3,
            moduleCode: fieldsHistory.moduleCode,
            functionCode: fieldsHistory.functionCode,
            isCurrent: fieldsHistory.isCurrent,
            versionNumber: fieldsHistory.versionNumber,
            tableName: fieldsHistory.tableName,
            section: fieldsHistory.section,
            displayText: fieldsHistory.displayText,
            value: fieldsHistory.value,
            actionName: fieldsHistory.actionName,
            createdDate: fieldsHistory.createdDate,
            createdBy: fieldsHistory.createdBy,
        });

        // Get the SQL and parameters from the query builder
        const [sql, parameters] = queryBuilder.getQueryAndParameters();

        // Execute the raw SQL with parameters using queryRunner
        await queryRunner.query(sql, parameters);
    }

    private async insertManyQuery(fieldsHistories: CreateFieldsHistoryDto[], queryRunner: QueryRunner): Promise<void> {
        // Create the query builder for the insert operation
        const queryBuilder = queryRunner.manager
            .createQueryBuilder()
            .insert()
            .into(J2FieldsHistoryEntity)
            .values(
                fieldsHistories.map((history) => ({
                    key1: history.key1,
                    key2: history.key2,
                    key3: history.key3,
                    moduleCode: history.moduleCode,
                    functionCode: history.functionCode,
                    isCurrent: history.isCurrent,
                    versionNumber: history.versionNumber,
                    tableName: history.tableName,
                    section: history.section,
                    displayText: history.displayText,
                    value: history.value,
                    actionName: history.actionName,
                    createdDate: history.createdDate,
                    createdBy: history.createdBy,
                })),
            );

        // Get the SQL and parameters from the query builder
        const [sql, parameters] = queryBuilder.getQueryAndParameters();

        // Execute the raw SQL with parameters using queryRunner
        await queryRunner.query(sql, parameters);
    }
}
