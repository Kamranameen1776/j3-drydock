import { ClassConstructor } from 'class-transformer';

import { validateAgainstModel } from '../../../../common/drydock/ts-helpers/validate-against-model';

/**
 * Request pipeline from Command Query Responsibility Segregation pattern
 */
export abstract class RequestPipeline<TRequest, TResponse> {

    /**
     * @param request Input data to handle
     * @param validationClass Model to validate against request
     * @returns Response from handling the request
     */
    public async ExecuteRequestAsync<Model extends object>(
        request: TRequest,
        validationClass: ClassConstructor<Model>,
    ): Promise<TResponse> {
        await this.AuthorizationHandlerAsync(request);

        await validateAgainstModel(validationClass, request as object);

        return this.MainHandlerAsync(request);
    }

    /**
     * @obsolete USE ExecuteRequestAsync
     */
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
            await validateAgainstModel(validationClass, (request as any)[validationKey]);
        }
    }

    protected abstract MainHandlerAsync(request: TRequest): Promise<TResponse>;
}
