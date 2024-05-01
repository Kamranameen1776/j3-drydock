export class OrderedCalls<T> {
    private execution: Promise<T> = Promise.resolve() as Promise<T>;

    public async ExecuteAsync(request: () => Promise<T>): Promise<T> {
        return (this.execution = this.execution.then(() => request()));
    }
}

class QueueElement<T> {
    private startTime = Date.now();
    private promise: Promise<T>;

    constructor(private request: () => Promise<T>, private previousElement: Promise<T>, private delay: number) {
        this.promise = this.doPromise();
    }

    private doPromise() {
        return new Promise<T>((res, rej) => {
            this.doCheck(res, rej);
        });
    }

    private doCheck(res: (value: T | PromiseLike<T>) => void, rej: (reason?: unknown) => void) {
        setTimeout(async () => {
            const pendingSymbol = Symbol('pending');
            const statusOrValue = await Promise.race([this.previousElement, pendingSymbol]);

            if (statusOrValue === pendingSymbol && this.startTime + this.delay < Date.now()) {
                this.doCheck(res, rej);
            } else {
                this.request().then(res).catch(rej);
            }
        }, 1);
    }

    public getPromise() {
        return this.promise;
    }
}

export class OptimisticQueue<T> {
    private queue: Promise<T>[] = [];

    public async ExecuteAsync(request: () => Promise<T>, delay = 600): Promise<T> {
        const length = this.queue.push(
            new QueueElement(
                request,
                this.queue[this.queue.length - 1] || (Promise.resolve() as Promise<T>),
                delay * this.queue.length,
            ).getPromise(),
        );

        return this.queue[length - 1];
    }
}
