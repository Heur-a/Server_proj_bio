
import { createPool } from 'mysql2/promise';
import { config } from 'dotenv';

config();

// Crear la connexió al pool amb les variables d'entorn
const pool = createPool({
    host: process.env.MYSQLDB_HOST,
    user: process.env.MYSQLDB_USER,
    password: process.env.MYSQLDB_PASSWORD,
    port: process.env.MYSQLDB_PORT || 3306,
    database: process.env.MYSQLDB_DATABASE,
    dateStrings: true
});

// Exportar el pool per utilitzar-lo en altres arxius
export default pool;
