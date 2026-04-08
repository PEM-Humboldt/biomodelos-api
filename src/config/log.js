import winston from 'winston';
import { config } from './application-config';
import { format } from 'morgan';

let log = null;

export const logger = () => {
  if (!log) {
    // logger dev and production config
    if (config.get('env') === 'development') {
      log = new winston.createLogger({
        transports: [
          new winston.transports.Console({
            prettyPrint: true,
            colorize: true,
            silent: false,
            timestamp: true
          })
        ],
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.timestamp(),
          winston.format.printf(({ timestamp, level, message }) => {
            return `${timestamp} ${level}: ${message}`;
          })
        )
      });
    } else if (config.get('env') === 'production') {
      log = new winston.createLogger({
        transports: [
          new winston.transports.Console({
            level: config.get('logs.level'),
            timestamp: true
          }),
          new winston.transports.File({
            filename: config.get('logs.location'),
            timestamp: true
          })
        ],
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.timestamp(),
          winston.format.printf(({ timestamp, level, message }) => {
            return `${timestamp} ${level}: ${message}`;
          })
        )
      });
    }
  }
  return log;
};
