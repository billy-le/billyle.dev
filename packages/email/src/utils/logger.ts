import winston, { format } from "winston";

const { errors, printf, combine, colorize, timestamp } = format;

export const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [new winston.transports.Console()],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: combine(
        errors({ stack: true }),
        colorize(),
        timestamp(),
        printf(
          ({ level, message, timestamp, stack }) =>
            `[${timestamp}]:${level}: ${message}${stack ? `\n\n${stack}` : ""}`
        )
      ),
    })
  );
}
