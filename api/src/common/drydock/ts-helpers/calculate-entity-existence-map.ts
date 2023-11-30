export interface EntityExistenceMap {
    [id: string]: boolean;
}

/** @private */
type List<Item> = readonly Item[] | ReadonlySet<Item>;

/** @private */
const DEFAULT_ID_KEY = 'uid';

/**
 * Given a list of UIDs and a list of entities (objects with `uid: string` property),
 * generates a map of `uid` → `boolean` pairs,
 * where the value (`boolean`) means whether the entity is found or not in the list
 *
 * @example
 * interface User {
 *   uid: string;
 *   name: string;
 * }
 *
 * const users: User[] = [{ id: 'u1', name: 'Alice' }, { id: 'u2', name: 'Bob' }];
 * const userIds = ['u2', 'u3'];
 *
 * calculateEntityExistenceMap(users, userIds);
 * // { 'u1': true, u2': true, 'u3': false }
 */
export function calculateEntityExistenceMap<Entity extends { readonly uid: string }>(
    entities: List<Entity>,
    uids: List<string>,
): EntityExistenceMap;

/**
 * Given a list of IDs and a list of entities (objects with the given id property, `'uid'` by default),
 * generates an object with `[idKey]: boolean` properties,
 * where the value (`boolean`) means whether the entity is found or not in the list
 *
 * @example
 * interface Item {
 *   id: string;
 *   price: number;
 * }
 *
 * const items: Item[] = [{ id: 'i1', price: 42 }, { id: 'i2', price: 17 }];
 * const itemIds = ['i2', 'i3'];
 *
 * calculateEntityExistenceMap(items, itemIds);
 * // { 'i2': false, 'i3': false }
 *
 * calculateEntityExistenceMap(items, itemIds, 'id');
 * // { 'i1': true, i2': true, 'i3': false }
 */
export function calculateEntityExistenceMap<IdKey extends string, Entity extends { readonly [Key in IdKey]: string }>(
    entities: List<Entity>,
    ids: List<string>,
    idKey?: IdKey,
): EntityExistenceMap;

export function calculateEntityExistenceMap<Entity extends object>(
    entities: List<Entity>,
    ids: List<string>,
    idKey = DEFAULT_ID_KEY as keyof Entity,
): EntityExistenceMap {
    const result = Object.create(null) as EntityExistenceMap;

    for (const entity of entities) {
        if (idKey in entity) {
            const id = entity[idKey] as string;

            result[id] = true;
        }
    }

    for (const id of ids) {
        result[id] ??= false;
    }

    return result;
}
