import winston from 'winston';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const DailyRotateFile = require('winston-daily-rotate-file');

const infoTransport = new DailyRotateFile({
  filename: './logs/info-%DATE%.log',
  datePattern: 'YYYY-ww',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '4w',
  level: 'info'
});

const errorTransport = new DailyRotateFile({
  filename: './logs/error-%DATE%.log',
  datePattern: 'YYYY-ww',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '4w',
  level: 'error'
});

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [infoTransport, errorTransport]
});

export default logger;