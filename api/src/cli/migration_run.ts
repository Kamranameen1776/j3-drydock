import { MssqlDBConnection } from 'j2utils';
import { createConnection, getConnectionOptions } from 'typeorm';
/**
 * added script in package.json for running migration - `npm run migrations`
 * Mssql connection is fetched from j2utils for getting the connectionOptions for .env of default values
 */
getConnectionOptions(process.env.orm_dbname)
    .then(async () => {
        const createdConnection = await createConnection(MssqlDBConnection.getMssqlConnectionOptions());
        await createdConnection.runMigrations({ transaction: 'none' });
        await createdConnection.close();
    })
    .catch((err) => {
        // error logging
        console.error(err);
    });
