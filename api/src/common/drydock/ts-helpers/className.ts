export function className<T>(type: new () => T): string {
    return (<any>new type()).constructor.name;
}
