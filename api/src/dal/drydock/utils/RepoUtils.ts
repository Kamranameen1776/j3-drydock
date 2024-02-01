import { getManager, ObjectType } from 'typeorm';

export class RepoUtils {
    public static getStringAggJoin(
        entity: ObjectType<unknown>,
        field: string,
        where: string,
        alias: string,
        join?: { entity: string; alias: string; on: string },
    ) {
        let query = getManager()
            .createQueryBuilder(entity, 'aliased')
            .select([`CONCAT(',', aliased.${field})`])
            .where(where);

        if (join) {
            query = query.innerJoin(join.entity, join.alias, join.on);
        }

        return `
            STUFF((${query.getSql()} FOR XML PATH('')), 1, 1, '') AS ${alias}
        `;
    }
}
