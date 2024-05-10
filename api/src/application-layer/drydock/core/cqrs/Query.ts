import { RequestPipeline } from './RequestPipeline';

/**
 * Query from Command Query Responsibility Segregation pattern
 */
export abstract class Query<TRequest extends object | void | string, TResponse> extends RequestPipeline<
    TRequest,
    TResponse
> {}
