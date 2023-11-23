import { getManager } from 'typeorm';

import { J2FieldsHistoryEntity } from '../../../entity/drydock/dbo/J2FieldsHistoryEntity';

export class FieldsHistoryRepository {
    public async saveFieldsHistory(fieldsHistory: J2FieldsHistoryEntity): Promise<J2FieldsHistoryEntity> {
        const fieldsHistoryRepository = getManager().getRepository(J2FieldsHistoryEntity);
        const data = await fieldsHistoryRepository.save(fieldsHistory);
        return data;
    }

    public async insertMany(fieldsHistories: J2FieldsHistoryEntity[]): Promise<void> {
        const fieldsHistoryRepository = getManager().getRepository(J2FieldsHistoryEntity);
        await fieldsHistoryRepository.insert(fieldsHistories);
    }
}
