// see: https://datatracker.ietf.org/doc/html/rfc7807
// [Problem Details for HTTP APIs]
export enum ProblemDetailsType {
    BusinessException = 'BusinessException',

    ApplicationException = 'ApplicationException',

    AuthorizationException = 'AuthorizationException',

    ValidationException = 'ValidationException',
}

export class ProblemDetails {
    public readonly params: {
        type: ProblemDetailsType;
        title: string;
        status?: number;
        detail?: string;
        instance?: string;
        errors?: string[];
    };

    constructor(params: {
        type: ProblemDetailsType;
        title: string;
        status?: number;
        detail?: string;
        instance?: string;
        errors?: string[];
    }) {
        this.params = params;
    }

    // returns an error object suitable for generic approach to error handling at JiBe on frontend
    public getJibeError() {
        return {
            name: this.params.title,
            message: this.params.detail,
        };
    }
}
