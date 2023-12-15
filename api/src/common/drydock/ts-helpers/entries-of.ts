/**
 * Runtime-optimized variant of {@link Object.entries}.
 * Returns each entry on demand, rather than pre-creating the whole array of them in advance.
 */
export function* entriesOf<O extends object>(
    object: O,
): IterableIterator<readonly [key: string & keyof O, value: O[keyof O]]> {
    for (const key in object) {
        yield [key, object[key]] as const;
    }
}
