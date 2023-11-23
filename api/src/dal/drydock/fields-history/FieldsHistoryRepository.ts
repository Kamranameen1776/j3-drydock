import { QueryRunner } from 'typeorm';

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
}
export class FieldsHistoryRepository {
    public async saveFieldsHistory(
        fieldsHistory: CreateFieldsHistoryDto,
        queryRunner: QueryRunner,
    ): Promise<J2FieldsHistoryEntity> {
        const fieldsHistoryRepository = queryRunner.manager.getRepository(J2FieldsHistoryEntity);
        const data = await fieldsHistoryRepository.save(fieldsHistory);
        return data;
    }

    public async insertMany(fieldsHistories: CreateFieldsHistoryDto[], queryRunner: QueryRunner): Promise<void> {
        const fieldsHistoryRepository = queryRunner.manager.getRepository(J2FieldsHistoryEntity);
        await fieldsHistoryRepository.insert(fieldsHistories);
    }
}
