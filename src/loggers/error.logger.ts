import winston, { Logger, format } from 'winston';
const { timestamp, colorize, printf } = format;

export const errorLogger: Logger = winston.createLogger({
  level: 'error',
  format: format.combine(
    timestamp(),
    colorize(),
    printf(({ level, message, timestamp, requestMethod, parsedArguments }) => {
      if (requestMethod) {
        return `${level}: ${timestamp} | ${message}\n | Request info |\n Request method -> ${requestMethod}\n Request arguments -> ${parsedArguments ? parsedArguments : 'no args'}`;
      }
      return `${level}: ${timestamp} | ${message} `;
    }),
  ),
  transports: [
    new winston.transports.Console(),
  ],
});
