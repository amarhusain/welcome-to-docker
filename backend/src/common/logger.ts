import { format, createLogger, transports } from 'winston';
import 'winston-daily-rotate-file';

const { combine, colorize, timestamp, label, printf } = format;

const errorLogFileRotateTransport = new transports.DailyRotateFile({
    level: 'error',
    filename: 'logs/error-rotate-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    maxFiles: '14d'
});

const combineLogFileRotateTransport = new transports.DailyRotateFile({
    filename: 'logs/combine-rotate-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    maxFiles: '14d'
});

//Using the printf format.
const customFormat = printf(({ level, message, label, timestamp }) => {
    return `${timestamp} ${level}: ${message}`;
});

let logger = createLogger({
    level: "debug",
    format: combine(timestamp({ format: 'MMM-DD-YYYY HH:mm:ss' }), customFormat),
    transports: [errorLogFileRotateTransport, combineLogFileRotateTransport],
});

// In development mode show logs in console too.
if (process.env.NODE_ENV === 'development') {
    logger.add(
        new transports.Console({
            format: combine(colorize(),
                label({ label: 'LOG' }),
                timestamp({ format: 'MMM-DD-YYYY HH:mm:ss' }),
                customFormat
            )
        })
    );
};

// In Test mode show logs only in console
if (process.env.NODE_ENV === 'test') {
    logger = createLogger({
        transports: [new transports.Console({ level: 'error' })]
    });
};

export default logger;