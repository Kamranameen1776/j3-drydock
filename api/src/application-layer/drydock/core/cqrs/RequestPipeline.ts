export abstract class RequestPipeline<TRequest, TResponse> {
    public async ExecuteAsync(request: TRequest): Promise<TResponse> {
        await this.AuthorizationHandlerAsync(request);

        await this.ValidationHandlerAsync(request);

        const result = await this.MainHandlerAsync(request);

        return result;
    }

    protected abstract AuthorizationHandlerAsync(request: TRequest): Promise<void>;

    protected abstract ValidationHandlerAsync(request: TRequest): Promise<void>;

    protected abstract MainHandlerAsync(request: TRequest): Promise<TResponse>;
}
