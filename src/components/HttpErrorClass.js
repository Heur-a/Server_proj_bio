export class HttpError extends Error {
    constructor(statusCode, message) {
        super(message); // Call the parent constructor with the message
        if (!statusCode){
            statusCode = 500;
        } else {
        this.statusCode = statusCode; // Assign the status code
        }
        this.name = this.constructor.name; // Set the error name to the class name
        Error.captureStackTrace(this, this.constructor); // Capture the stack trace
    }
}
