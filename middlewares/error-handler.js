const { STATUS_CODES } = require("../utils/constants");

function errorHandler(err, req, res, next) {
  console.error(err.stack || err.message);

  const statusCode = err.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR;

  const message =
    statusCode === STATUS_CODES.INTERNAL_SERVER_ERROR
      ? "An internal server error occurred"
      : err.message;

  res.status(statusCode).send({ message });
}

module.exports = errorHandler;
