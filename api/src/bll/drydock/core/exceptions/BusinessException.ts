/*
 * Used to throw exceptions from the business layer
 * This type of exceptions contains message that could be shown to the client
 *
 * A Business Exception describes an error rooted in the fact
 * that certain data which the project depends on is incomplete or missing.
 */

export interface BusinessExceptionParams {
    message: string;
    description?: string;
}
export class BusinessException extends Error {
    public readonly Details: BusinessExceptionParams;

    constructor(message: string | BusinessExceptionParams) {
        if (typeof message == 'string') {
            super(message);
            this.Details = { message };
            return;
        }
        super(message.message);
        this.Details = message as BusinessExceptionParams;
    }
}
