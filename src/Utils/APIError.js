class ApiError extends Error {
    constructor(statusCode, message = "Something went wrong", errors = []) {
        // Call the parent constructor with the message
        super(message);

        // Assign properties
        this.statusCode = statusCode;
        this.data = null;
        this.success = false;
        this.errors = errors;

        // Ensure the stack trace is correctly captured
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export { ApiError };
