/**
 * Returns the name of the class of the given type.
 * @param type Type.
 * @returns Name of the class.
 */
export function className<T>(type: new () => T): string {
    return (<any>new type()).constructor.name;
}
