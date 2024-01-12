import { Server } from 'http';
import { MssqlDBConnection } from 'j2utils';
import { Connection, createConnection, getConnectionOptions } from 'typeorm';

import app from './app';
import { log } from './logger';

const PORT = process.env.PORT || 3020;
console.log(PORT);
process.env.basedir = __dirname;

let server: Server | undefined;

const startServer = async () => {
    let databaseConnection: Connection | undefined;

    try {
        // 1. Open database connections pool
        // note that it's not active database connection
        // TypeORM creates connection pools and uses them for your requests
        await getConnectionOptions(process.env.orm_dbname);

        databaseConnection = await createConnection(MssqlDBConnection.getMssqlConnectionOptions());
        // const databaseConnection = await createConnection({ ...conn, name: "default" });
        /* ******************** DO NOT ENABLE .driver.isReturningSqlSupported ******************** */
        // enables/disables returning result statements
        databaseConnection.driver.isReturningSqlSupported = () => false; // this is needed for getting uid result of insert transactions
        // if you need to get a result after your update\insert SQL =>
        // make sure the table\view entity is set to apply uuid() method to the uniqueidentifier's column
        // *this uuid() method is from a library (see package.json) for generating UIDs
        // this insures the returning statement returns the auto-generated uid without relying on external driver support

        server = app.listen(PORT, () => {
            console.log(`Node server listening on http://localhost:${PORT}`);
        });
    } catch (error) {
        await log.error(error, 'Error starting server');

        await databaseConnection?.close();

        process.exit(1);
    }
};

startServer();

process.on('uncaughtException', (err) => {
    log.error(err, 'Uncaught exception');
});

process.on('unhandledRejection', (err) => {
    log.error(err, 'Unhandled rejection');
});

export = { app, server };
