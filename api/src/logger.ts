import { Config, Logger } from 'j2utils';
import { LogLevel } from 'j2utils/dist/logger/logger';

// we don't want to send local logs to the remote databases
if (process.env.NODE_ENV === 'development') {
    Config.config.logger.minLevel.db = -1 as LogLevel;
}

export const log = new Logger('drydock-api');
