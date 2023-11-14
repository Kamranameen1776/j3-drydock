/**
 * Returns the name of the class of the given type.
 * @param type Type.
 * @returns Name of the class.
 * @deprecated The function instantiates the given class without arguments, which can lead to unexpected side effects. Use `.name` property of classes instead (e.g., `RegExp.name`; see {@link Function} interface).
 */
export function className<T extends object>(type: new () => T): string {
    return new type().constructor.name;
}
