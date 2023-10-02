import { RequestPipeline } from './RequestPipeline';

export abstract class Command<TRequest, TResponse> extends RequestPipeline<TRequest, TResponse> {}
