const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

const errorHandler = (error, req, res, next) => {
    // If we get a SyntaxError with status 400, it's likely a JSON parsing error
    if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
        return res.status(400).send({ message: 'Invalid JSON payload' });
    }

    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        message: error.message,
        stack: process.env.NODE_ENV === 'production' ? null : error.stack,
    });
};

export { notFound, errorHandler };