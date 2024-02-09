import { RequestPipeline } from './RequestPipeline';

/**
 * Command from Command Query Responsibility Segregation pattern
 */
export abstract class Command<TRequest extends object | void | string, TResponse> extends RequestPipeline<TRequest, TResponse> {}
