/**
 * Request pipeline from Command Query Responsibility Segregation pattern
 */
export abstract class RequestPipeline<TRequest, TResponse> {
    public async ExecuteAsync(request: TRequest): Promise<TResponse> {
        await this.AuthorizationHandlerAsync(request);

        await this.ValidationHandlerAsync(request);

        return this.MainHandlerAsync(request);
    }

    protected async AuthorizationHandlerAsync(request: TRequest): Promise<void> {}

    protected async ValidationHandlerAsync(request: TRequest): Promise<void> {}

    protected abstract MainHandlerAsync(request: TRequest): Promise<TResponse>;
}
