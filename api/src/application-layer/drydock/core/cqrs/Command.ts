import { RequestPipeline } from './RequestPipeline';

/**
 * Command from Command Query Responsibility Segregation pattern
 */
export abstract class Command<TRequest, TResponse> extends RequestPipeline<TRequest, TResponse> {}
