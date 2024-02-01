import { ClassConstructor } from 'class-transformer';
import { getRepository } from 'typeorm';

export function getTableName<T>(entityClass: ClassConstructor<T>): string {
    const { schema, tableName } = getRepository(entityClass).metadata;
    return `${schema}.${tableName}`;
}
