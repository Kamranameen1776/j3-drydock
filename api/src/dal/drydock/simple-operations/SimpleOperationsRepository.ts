import { chunk } from 'lodash';
import { EntitySchema, ObjectType, QueryRunner } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

import { getChunkSize } from '../../../shared/utils/get-chunk-size';

interface SimpleOperationsRepositoryOptions {
    chunk?: number;
    reload?: boolean;
}

export class SimpleOperationsRepository {
    public async insertMany<Entity>(
        target: ObjectType<Entity> | EntitySchema<Entity> | string,
        entity: QueryDeepPartialEntity<Entity> | QueryDeepPartialEntity<Entity>[],
        queryManager: QueryRunner,
        options: SimpleOperationsRepositoryOptions = {},
    ) {
        if (options?.chunk !== undefined && Array.isArray(entity)) {
            return Promise.all(
                chunk(entity, getChunkSize(options.chunk)).map((chunkItems) => {
                    return this.insertManySimple(target, chunkItems, queryManager, options);
                }),
            );
        } else {
            return this.insertManySimple(target, entity, queryManager, options);
        }
    }

    private async insertManySimple<Entity>(
        target: ObjectType<Entity> | EntitySchema<Entity> | string,
        entity: QueryDeepPartialEntity<Entity> | QueryDeepPartialEntity<Entity>[],
        queryManager: QueryRunner,
        options: SimpleOperationsRepositoryOptions = {},
    ) {
        const result = await queryManager.manager
            .createQueryBuilder()
            .insert()
            .into(target)
            .values(entity)
            .updateEntity(options?.reload ?? false)
            .execute();

        if (options?.reload) {
            return result;
        } else {
            return entity;
        }
    }
}
