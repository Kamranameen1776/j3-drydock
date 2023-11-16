/**
 * Request pipeline from Command Query Responsibility Segregation pattern
 */
export abstract class RequestPipeline<TRequest, TResponse> {
    public async ExecuteAsync(request: TRequest): Promise<TResponse> {
        await this.AuthorizationHandlerAsync(request);

        await this.ValidationHandlerAsync(request);

        return this.MainHandlerAsync(request);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
    protected async AuthorizationHandlerAsync(request: TRequest): Promise<void> {}

    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
    protected async ValidationHandlerAsync(request: TRequest): Promise<void> {}

    protected abstract MainHandlerAsync(request: TRequest): Promise<TResponse>;
}
