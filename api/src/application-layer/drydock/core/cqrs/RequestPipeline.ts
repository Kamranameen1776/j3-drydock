import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { AccessRights } from 'j2utils';

import { UserFromToken } from './UserDto';

/**
 * Request pipeline from Command Query Responsibility Segregation pattern
 */
export abstract class RequestPipeline<TRequest, TResponse> {
    public async ExecuteAsync(request: TRequest, validationClass?: any, validationKey = 'body'): Promise<TResponse> {
        const user = this.decodeAuthorizationMiddleware(request);

        await this.AuthorizationHandlerAsync(request);

        await this.ValidationHandlerAsync(request, validationClass, validationKey);

        const res = await this.MainHandlerAsync(request);

        try {
            this.AfterExecution(request, res, user);
        } finally {
            return res;
        }
    }

    private decodeAuthorizationMiddleware(request: TRequest): UserFromToken {
        try {
            return AccessRights.authorizationDecode(request);
        } catch (error) {
            throw new Error('Cannot decode authorization token');
        }
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

    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
    protected async AfterExecution(request: TRequest, response: TResponse, user: UserFromToken): Promise<void> {}
}
