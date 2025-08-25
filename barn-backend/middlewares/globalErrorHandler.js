const globalErrorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(statusCode).json({
        status: statusCode,
        message: err.message,
        erroeStack: config.nodeEnv === "development" ? err.stack : null,
    });
}

module.exports = globalErrorHandler;