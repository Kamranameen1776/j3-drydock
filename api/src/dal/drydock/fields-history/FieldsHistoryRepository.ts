import { getConnection, QueryRunner } from 'typeorm';

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
        for (const fieldsHistory of fieldsHistories) {
            await this.insertQuery(fieldsHistory, queryRunner);
        }
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
}
