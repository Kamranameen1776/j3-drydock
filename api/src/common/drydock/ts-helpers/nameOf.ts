/**
 * Returns the name of the property as a string
 * @param nameExtractor Property extractor
 * @returns name of the property
 */
export function nameOf<T extends object>(nameExtractor: (obj: T) => any): keyof T {
    const proxy = new Proxy({} as T, {
        get(target, prop: string | symbol) {
            return prop;
        },
    });

    return nameExtractor(proxy);
}
