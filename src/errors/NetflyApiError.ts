export class NetflyApiError extends Error {
    readonly status: number;
    readonly code?: string;
    readonly responseBody?: unknown;

    constructor(
        message: string,
        status: number,
        code?: string,
        responseBody?: unknown
    ) {
        super(message);
        this.name = 'NetflyApiError';
        this.status = status;
        this.code = code;
        this.responseBody = responseBody;
    }
}
