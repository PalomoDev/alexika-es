import winston from 'winston';

const createLogger = (filename: string) => {
    return winston.createLogger({
        level: 'info',
        format: winston.format.combine(
            winston.format.label({ label: filename }),
            winston.format.printf(({ label, level, message }) => {
                return `[${label}] ${level}: ${message}`;
            })
        ),
        transports: [
            new winston.transports.Console(),
            new winston.transports.File({ filename: 'combined.log' })
        ]
    });
};

export default createLogger;