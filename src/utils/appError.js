
class AppError extends Error {
    constructor(message, statusCode, ...params) {
        super(...params);
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'Fail' : 'Error';
        this.message = message;
    }
}
module.exports = AppError;