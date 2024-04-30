import { AmqpConnection, PubSub } from 'j3-mq';

import { Callback, topicToHandlerMap } from './subscriptions';

const MIN_SYNC_TIME = 5;

// eslint-disable-next-line @typescript-eslint/naming-convention
export class RabbitMQClient {
    private static instance: Promise<PubSub>;
    private static syncTime = Math.max(MIN_SYNC_TIME, parseInt(process.env.SYNC_TIME || '') || MIN_SYNC_TIME) * 60e3;

    public static async getInstance(): Promise<PubSub> {
        if (!this.instance) {
            const amqpConnection = new AmqpConnection({
                protocol: process.env.MQ_PROTOCOL,
                username: process.env.MQ_USERNAME,
                password: process.env.MQ_PASSWORD,
                hostname: process.env.MQ_HOSTNAME,
                port: Number(process.env.MQ_PORT) || 5672,
                vhost: process.env.MQ_VHOST,
            });

            const prefetchCount = Number(process.env.MQ_PREFETCH_COUNT) || 10;

            amqpConnection.on('reconnected', async () => {
                console.log('AMQP connection has reconnected to the server');
                await amqpConnection.setConsumerPrefetchCount(prefetchCount);
            });

            amqpConnection.on('channelRecreated', async () => {
                console.log('AMQP channel has been re-created');
                await amqpConnection.setConsumerPrefetchCount(prefetchCount);
            });

            amqpConnection.on('error', (error) => {
                console.error('AMQP connection error:', error);
            });

            amqpConnection.on('closed', () => {
                console.error('AMQP connection has closed');
            });

            await amqpConnection.connect();
            await amqpConnection.setConsumerPrefetchCount(prefetchCount);

            const pubSub = new PubSub({ amqpConnection });

            for (const [topic, cb] of Object.entries(topicToHandlerMap)) {
                const executeCallback = async (cb: Callback, payload: unknown) => {
                    if (cb.processed) {
                        return;
                    }

                    try {
                        await cb(payload);
                    } catch (error) {
                        console.error(`Error processing message: ${error}`);
                    }
                    cb.processed = true;
                };

                const handler = (payload: unknown) => {
                    // run callback no earlier than once in SYNC_TIME
                    cb.payload = payload;
                    cb.processed = false;
                    if (!cb.timerId) {
                        executeCallback(cb, payload);
                        cb.timerId = setTimeout(() => {
                            executeCallback(cb, payload);
                            cb.timerId = undefined;
                        }, RabbitMQClient.syncTime);
                    }
                };

                await pubSub.subscribe(topic, handler, { queueName: topic });
                console.log(`Subscribed to ${topic}`);
            }

            this.instance = Promise.resolve(pubSub);
        }

        return this.instance;
    }
}
