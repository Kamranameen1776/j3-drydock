import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

/**
 * Request pipeline from Command Query Responsibility Segregation pattern
 */
export abstract class RequestPipeline<TRequest, TResponse> {
    public async ExecuteAsync(request: TRequest, validationClass?: any, validationKey = 'body'): Promise<TResponse> {
        await this.AuthorizationHandlerAsync(request);

        await this.ValidationHandlerAsync(request, validationClass, validationKey);

        return this.MainHandlerAsync(request);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
    protected async AuthorizationHandlerAsync(request: TRequest): Promise<void> {}

    protected async ValidationHandlerAsync(
        request: TRequest,
        validationClass?: any,
        validationKey = 'body',
    ): Promise<void> {
        if (validationClass) {
            const dto = plainToInstance(validationClass, (request as any)[validationKey]);
            const result = await validate(dto as any);
            if (result.length) {
                throw result;
            }
        }
    }

    protected abstract MainHandlerAsync(request: TRequest): Promise<TResponse>;
}
