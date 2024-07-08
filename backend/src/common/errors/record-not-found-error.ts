import { CustomError } from "./custom-error";


export class RecordNotFoundError extends CustomError {
    statusCode = 404;

    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, RecordNotFoundError.prototype);
    }

    serializeErrors() {
        return [{ message: this.message }]
    };
}