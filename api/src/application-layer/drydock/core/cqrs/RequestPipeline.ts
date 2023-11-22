/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any */
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { SynchronizerService } from 'j2utils';

export class SynchronizerServiceData {
    TableName: string;
    PKKey: string;
    PKValue: string;
    VesselId: number | (() => Promise<number>);
}

/**
 * Request pipeline from Command Query Responsibility Segregation pattern
 */
export abstract class RequestPipeline<TRequest, TResponse> {
    private syncData: Array<SynchronizerServiceData> = [];

    protected pushSyncData(data: SynchronizerServiceData) {
        this.syncData.push(data);
    }

    private async getSyncPromise(data: SynchronizerServiceData) {
        const { TableName, PKKey, PKValue, VesselId } = data;
        if (typeof VesselId === 'number') {
            return SynchronizerService.dataSynchronize(TableName, PKKey, PKValue, VesselId);
        } else {
            return SynchronizerService.dataSynchronize(TableName, PKKey, PKValue, await VesselId());
        }
    }

    public async ExecuteAsync(request: TRequest, validationClass?: any, validationKey = 'body'): Promise<TResponse> {
        await this.AuthorizationHandlerAsync(request);

        await this.ValidationHandlerAsync(request, validationClass, validationKey);

        const res = await this.MainHandlerAsync(request);

        await this.SynchronizeHandler();

        return res;
    }

    protected async AuthorizationHandlerAsync(request: TRequest): Promise<void> {
        return;
    }

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

    protected async SynchronizeHandler() {
        const promiseArray = this.syncData.map((data) => {
            return this.getSyncPromise(data);
        });
        await Promise.all(promiseArray);
    }
}
