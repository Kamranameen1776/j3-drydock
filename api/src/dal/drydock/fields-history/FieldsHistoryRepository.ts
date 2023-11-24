import { getConnection, QueryRunner } from 'typeorm';

import { J2FieldsHistoryEntity } from '../../../entity/drydock/dbo/J2FieldsHistoryEntity';

export type CreateFieldsHistoryDto = {
    key1: string;
    key2: string;
    key3: string;
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
        const sql = `
            INSERT INTO j2_fields_history
            (key_1, key_2, key_3, module_code, function_code, is_current, version_number, table_name, section,
             display_text, value, action_name, created_date, created_by)
            VALUES
            (@0, @1, @2, @3, @4, @5, @6, @7, @8, @9, @10, @11, @12, @13)
        `;

        await queryRunner.manager.query(sql, [
            fieldsHistory.key1,
            fieldsHistory.key2,
            fieldsHistory.key3,
            fieldsHistory.moduleCode,
            fieldsHistory.functionCode,
            fieldsHistory.isCurrent,
            fieldsHistory.versionNumber,
            fieldsHistory.tableName,
            fieldsHistory.section,
            fieldsHistory.displayText,
            fieldsHistory.value,
            fieldsHistory.actionName,
            fieldsHistory.createdDate,
            fieldsHistory.createdBy,
        ]);
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
