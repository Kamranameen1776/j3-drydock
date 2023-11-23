import { RequestPipeline } from './RequestPipeline';

/**
 * Query from Command Query Responsibility Segregation pattern
 */
export abstract class Query<TRequest, TResponse> extends RequestPipeline<TRequest, TResponse> {}
