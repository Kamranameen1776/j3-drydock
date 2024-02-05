// This script tails the logs from the DB.
// Put .env file in the root of the project and use the command "npm run tail-logs" to run the script.
import * as sql from 'mssql';
import yargs from 'yargs/yargs';
import 'dotenv/config';

// log levels of J2Utils Logger
const LogLevel = {
    0: 'error',
    1: 'warn',
    2: 'info',
    3: 'verbose',
    4: 'debug',
    5: 'silly',
    6: 'console'
}

const checkFrequency = 1000;

interface LogRecord {
    api: string;
    log_level: number;
    log_data: string;
    log_message: string;
    date_of_creation: Date;
    os_hostname: string;
}

function formatLogRecord(record: LogRecord) {
    const logLevel = LogLevel[record.log_level];
    const logData = JSON.stringify(JSON.parse(record.log_data), null, 2);
    return `${record.os_hostname} ${record.date_of_creation.toISOString()} [${logLevel}] [${record.api}] ${record.log_message}\n${logData}`;
}

async function tailRecords({ api, lastXRecords, hostname }: { api: string, lastXRecords: number, hostname: string }) {
    const pool = new sql.ConnectionPool({
        server: process.env.TYPEORM_HOST,
        database: process.env.TYPEORM_DATABASE,
        user: process.env.TYPEORM_USERNAME,
        password: process.env.TYPEORM_PASSWORD,
        port: +process.env.TYPEORM_PORT,
        options: {
            encrypt: false,
        },
    });

    const filter = 'api = @api' + (hostname ? ' AND os_hostname = @hostname' : '');

    console.log(`Filters applied:\napi: ${api}\nhostname: ${hostname || '*'}\n`);

    try {
        console.log('Connecting...');
        await pool.connect();

        let lastRecords = [];
        if (lastXRecords) {
            console.log(`Fetching last ${lastXRecords} records...`);
            const result = await pool
                .request()
                .input('api', sql.VarChar, api)
                .input('hostname', sql.VarChar, hostname)
                .query(`SELECT TOP ${lastXRecords} * FROM dbo.inf_log WHERE ${filter} ORDER BY date_of_creation DESC`);

            lastRecords = result.recordset.reverse();

            for (const record of lastRecords) {
                console.log(formatLogRecord(record));
            }
        }

        // Start tailing for new records
        const query = `SELECT * FROM dbo.inf_log WHERE ${filter} AND date_of_creation > @lastDate`;

        let lastDate = lastRecords.length > 0 ? lastRecords[0].date_of_creation : new Date();

        console.log(`Listening for new records...\n`);
        while (true) {
            const tailResult = await pool
                .request()
                .input('api', sql.VarChar, api)
                .input('hostname', sql.VarChar, hostname)
                .input('lastDate', sql.DateTime, lastDate)
                .query(query);

            const newRecords = tailResult.recordset;

            for (const record of newRecords) {
                console.log(formatLogRecord(record));
                lastDate = record.date_of_creation;
            }

            await new Promise(resolve => setTimeout(resolve, checkFrequency));
        }
    } catch(err) {
        console.error('Error during execution', err);
        process.exitCode = 1;
    } finally {
        await pool.close();
    }
}

const argv = yargs(process.argv.slice(2))
    .options({
        api: { type: 'string', default: 'drydock-api', describe: 'API filter value' },
        hostname: { type: 'string', describe: 'Hostname filter value' },
        lastXRecords: { type: 'number', describe: 'Number of last records to fetch' },
    })
    .parseSync();

tailRecords({ api: argv.api, lastXRecords: argv.lastXRecords, hostname: argv.hostname });
