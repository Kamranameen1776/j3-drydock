import { RequestPipeline } from './RequestPipeline';

export abstract class Query<TRequest, TResponse> extends RequestPipeline<TRequest, TResponse> {}
