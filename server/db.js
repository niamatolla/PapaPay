import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

function pick(...values) {
    return values.find((value) => value !== undefined && value !== null && value !== '');
}

function buildDbConfig() {
    const connectionUrl = pick(process.env.DATABASE_URL, process.env.MYSQL_URL, process.env.MYSQL_URL_PUBLIC);

    if (connectionUrl) {
        const parsed = new URL(connectionUrl);
        return {
            host: parsed.hostname,
            port: Number(parsed.port || 3306),
            user: decodeURIComponent(parsed.username),
            password: decodeURIComponent(parsed.password),
            database: parsed.pathname.replace(/^\//, ''),
        };
    }

    return {
        host: pick(process.env.MYSQL_HOST, process.env.MYSQLHOST),
        port: Number(pick(process.env.MYSQL_PORT, process.env.MYSQLPORT, 3306)),
        user: pick(process.env.MYSQL_USER, process.env.MYSQLUSER),
        password: pick(process.env.MYSQL_PASSWORD, process.env.MYSQLPASSWORD),
        database: pick(process.env.MYSQL_DATABASE, process.env.MYSQLDATABASE),
    };
}

const dbConfig = buildDbConfig();
if (!dbConfig.host || !dbConfig.user || !dbConfig.database) {
    throw new Error(
        'Database config missing. Set DATABASE_URL / MYSQL_URL or MYSQL_HOST(MYSQLHOST), MYSQL_USER(MYSQLUSER), MYSQL_DATABASE(MYSQLDATABASE).'
    );
}

export const pool=mysql.createPool({

host:dbConfig.host,
port:dbConfig.port,
user:dbConfig.user,
password:dbConfig.password,
database:dbConfig.database,
waitForConnections:true,
connectionLimit:10,

});

//quick test helper to call once if i want to 

export async function ping(){
    const [rows]=await pool.query('Select 1 as ok');
    return(rows[0].ok===1);
}