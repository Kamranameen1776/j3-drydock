import { getRepository } from 'typeorm';

/**
 * Returns table name from typeorm Entity.
 * @param type Type.
 * @returns Name of the class.
 */
type EntityClass = new () => any;
export function getTableName(entityClass: EntityClass): string {
    const { schema, tableName } = getRepository(entityClass).metadata;
    return `${schema}.${tableName}`;
}
