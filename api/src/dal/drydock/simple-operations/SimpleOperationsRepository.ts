import { chunk } from 'lodash';
import { EntitySchema, ObjectType, QueryRunner } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

import { QueryRunnerManager } from '../../../application-layer/drydock/core/uof/ParallelUnitOfWork';
import { getChunkSize } from '../../../shared/utils/get-chunk-size';

interface SimpleOperationsRepositoryOptions {
    chunk?: number;
    reload?: boolean;
}

export interface Task {
    runner: QueryRunner;
    uids: string[];
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

    public async insertManyTasks<Entity>(
        target: ObjectType<Entity> | EntitySchema<Entity> | string,
        entity: QueryDeepPartialEntity<Entity> | QueryDeepPartialEntity<Entity>[],
        queryManager: QueryRunnerManager,
        uidGetter: (entity: QueryDeepPartialEntity<Entity>) => string,
        options: SimpleOperationsRepositoryOptions = {},
    ) {
        if (options?.chunk !== undefined && Array.isArray(entity)) {
            return Promise.all(
                chunk(entity, getChunkSize(options.chunk)).map(async (chunkItems) => {
                    const runner = queryManager.runner;
                    const uids = chunkItems.map(uidGetter);

                    await this.insertManySimple(target, chunkItems, runner, options);

                    return {
                        runner,
                        uids,
                    };
                }),
            );
        } else {
            const runner = queryManager.runner;
            await this.insertManySimple(target, entity, runner, options);
            return [
                {
                    runner: runner,
                    uids: Array.isArray(entity) ? entity.map(uidGetter) : [uidGetter(entity)],
                },
            ];
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
