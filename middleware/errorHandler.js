const {constants} = require('../constants');
const errorHandler = (err, req, res, next) => {
    // Use err.statusCode if it exists, otherwise default to 500
    const statusCode = err.statusCode || 500;
    res.status(statusCode); // Set the correct status code on the response

    switch (statusCode) {
        case constants.VALIDATION_FAILED:
            res.json({title: "Validation Failed", message: err.message, stackTrace: err.stack});
            break;

        case constants.UNAUTHORIZED:
            res.json({title: "Unauthorized", message: err.message, stackTrace: err.stack});
            break;
            
        case constants.FORBIDDEN:
            res.json({title: "Forbidden", message: err.message, stackTrace: err.stack});
            break;

        case constants.NOT_FOUND:
            res.json({title: "Not Found", message: err.message, stackTrace: err.stack});
            break;
            
        case constants.SERVER_ERROR:
            res.json({title: "Server Error", message: err.message, stackTrace: err.stack});
            break;

            default:
                res.json({title: "Error", message: err.message, stackTrace: process.env.NODE_ENV === 'development' ? err.stack : undefined});
                break;
        }
    };

module.exports = errorHandler;