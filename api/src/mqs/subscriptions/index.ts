import { createSpecificationFromStandardJobs } from './create-specifications-from-standard-jobs/create-specifications-from-standard-jobs';

export enum RabbitMQTopic {
    CREATE_SPECIFICATIONS_FROM_STANDARD_JOBS = 'j3_drydock/create_specifications_from_standard_jobs',
}

export type CallbackFn = (payload: any) => Promise<void>;

export interface Callback extends CallbackFn {
    queues?: Set<string>;
    callbackId?: string;
    payload?: unknown;
    processed?: boolean;
    timerId?: NodeJS.Timeout;
}

export const topicToHandlerMap: Record<RabbitMQTopic, Callback> = {
    [RabbitMQTopic.CREATE_SPECIFICATIONS_FROM_STANDARD_JOBS]: createSpecificationFromStandardJobs,
};
