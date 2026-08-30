import pino from "pino";
import { config } from "../config";

// const PRODUCTION = process.env.NODE_ENV === "production";
const PRODUCTION = false;

// write to stdout in dev, and to a batterStack in production
const transport = pino.transport({
  targets: [
    PRODUCTION ? {
      target: '@logtail/pino',
      options: {
        sourceToken: config.PINO_TOKEN,
        colorize: true,
        translateTime: true,
        level: 'trace',
        messageKey: 'message',
        ignore: 'pid,hostname',
      },
    } : {
      target: 'pino/file',
      options: {
        destination: 1,
        sync: true,
        level: 'info',
        messageKey: 'message',
        ignore: 'pid,hostname',
      },
    },
    {
      target: 'pino/file',
      options: {
        destination: './logs/api.log',
        mkdir: true,
        sync: true,
        level: PRODUCTION ? 'info' : 'trace',
        messageKey: 'message',
        ignore: 'pid,hostname',
        translateTime: true,
      },
    }
  ],

});
const logger = pino({}, transport);
export const networkLogger = logger.child({ "networkLogger": true })
export const screenshotLogger = logger.child({ "screenshotLogger": true })

export default logger
