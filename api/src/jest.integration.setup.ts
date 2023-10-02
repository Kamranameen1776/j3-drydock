import 'dotenv/config';

import { AccessRights, MssqlDBConnection } from 'j2utils';
import { Connection, createConnection, getConnectionOptions } from 'typeorm';

import { log } from './logger';

// Mock access rights middleware
AccessRights.accessRightsMiddleware = (req, res, next) => {
    if (req.get('Authorization')) {
        req.user = { userUid: req.get('Authorization') };

        return next();
    }
    res.sendStatus(401);
};

// Required: mock logger to prevent database write operations
log['writeLog'] = console.log;
log.info = jest.fn();
log.warn = jest.fn();
log.error = jest.fn();
log.debug = jest.fn();
log.verbose = jest.fn();
log.silly = jest.fn();

// Setup and Tear down scripts
let databaseConnection: Connection | undefined;
beforeAll(async () => {
    // Setup database connect
    await getConnectionOptions(process.env.orm_dbname);
    databaseConnection = await createConnection(MssqlDBConnection.getMssqlConnectionOptions());
    databaseConnection.driver.isReturningSqlSupported = () => false; // this is needed for getting uid result of insert transactions
});

afterAll(async () => {
    databaseConnection?.close();
});
