const winston = require('winston');
const { transports } = require('winston-daily-rotate-file');

const infoTransport = new transports.DailyRotateFile({
  filename: '../../logs/info-%DATE%.log',
  datePattern: 'YYYY-ww',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '12w',
  level: 'info'
});

const errorTransport = new transports.DailyRotateFile({
  filename: '../../logs/error-%DATE%.log',
  datePattern: 'YYYY-ww',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '12w',
  level: 'error'
});

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [infoTransport, errorTransport]
});

export { logger };