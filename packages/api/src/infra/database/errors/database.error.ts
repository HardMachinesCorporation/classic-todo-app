import {PG_ERROR_MESSAGES} from "./constant";
import {ErrorDetail} from "./error-detail.interface";

export class DatabaseError extends Error {
    code: string;
    details?: ErrorDetail;
    constructor(code: string, message: string, details?: string) {
        super(PG_ERROR_MESSAGES[code] || message);
        this.name = 'DatabaseError';
        this.code = code
        this.details = details as unknown as ErrorDetail;
    }
}