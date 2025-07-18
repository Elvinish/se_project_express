const winston = require("winston");
const expressWinston = require("express-winston");

// custom format for console logs
const messageFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.printf(
    ({ level, message, meta, timestamp }) =>
      `${timestamp} ${level}: ${meta?.error?.stack || message}`
  )
);

// Request logger
const requestLogger = expressWinston.logger({
  transports: [
    new winston.transports.Console({
      format: messageFormat, // human-friendly format in console
    }),
    new winston.transports.File({
      filename: "request.log",
      format: winston.format.json(), // machine-friendly log file
    }),
  ],
});

// error logger
const errorLogger = expressWinston.errorLogger({
  transports: [new winston.transports.File({ filename: "error.log" })],
  format: winston.format.json(),
});

module.exports = {
  requestLogger,
  errorLogger,
};
