import winston, { format } from "winston";

const { errors, printf, combine, colorize, timestamp } = format;

export const logger = winston.createLogger({
  level: "info",
});

logger.add(
  new winston.transports.Console({
    format: combine(
      errors({ stack: true }),
      colorize({ all: true }),
      timestamp(),
      printf(
        ({ level, message, timestamp, stack }) =>
          `[${timestamp}]:${level}: ${message}${stack ? `\n\n${stack}` : ""}`
      )
    ),
  })
);
