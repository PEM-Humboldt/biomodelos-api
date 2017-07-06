import winston from 'winston';
import { config } from './application-config';

let log = null;

export const logger = () => {
  if (!log) {
    // logger dev and production config
    if (config.get('env') === 'development') {
      log = new winston.Logger({
        transports: [
          new winston.transports.Console({
            prettyPrint: true,
            colorize: true,
            silent: false,
            timestamp: true
          })
        ]
      });
    } else if (config.get('env') === 'production') {
      log = new winston.Logger({
        transports: [
          new winston.transports.Console({
            level: config.get('logs.level'),
            timestamp: true
          }),
          new winston.transports.File({
            filename: config.get('logs.location'),
            timestamp: true
          })
        ]
      });
    }
  }
  return log;
};
