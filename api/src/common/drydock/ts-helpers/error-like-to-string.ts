/**
 * Returns maximum information about a caught exception as a string.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function errorLikeToString(errorLike: any) {
    return errorLike.stack || errorLike.toString();
}
