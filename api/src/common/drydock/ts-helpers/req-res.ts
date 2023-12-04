import { type Request } from 'express';

/** @private */
type Params = Record<string, string>;

/**
 * A version of express's {@link Request} which only requires request body as a type argument
 */
export type Req<Body extends object> = Request<Params, unknown, Body>;

// Express's `Response` type is already body-oriented,
// re-exporting it as-is from here for completeness sake
export { type Response as Res } from 'express';
