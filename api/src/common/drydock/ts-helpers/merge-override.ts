/**
 * @example
 * type Wrong = { foo: string, bar: string } & { bar: number, baz: boolean }
 * // { foo: string, bar: never, baz: boolean }
 *                        ^^^^^
 *
 * type Right = MergeOverride<{ foo: string, bar: string }, { bar: number, baz: boolean }>
 * // { foo: string, bar: number, baz: boolean }
 *                        ^^^^^^
 */
export type MergeOverride<Left extends object, Right extends object> = Omit<Left, keyof Right> & Right;
