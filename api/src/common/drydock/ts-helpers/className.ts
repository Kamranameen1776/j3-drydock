/**
 * Returns the name of the class of the given type.
 * @param type Type.
 * @returns Name of the class.
 */
export function className<T extends object>(type: new () => T): string {
    return type.name;
}
