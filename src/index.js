import express from 'express' 
import { createPool } from 'mysql2/promise'
import second from 'dotenv/config'

const app = express()

console.log(
    {
        host: process.env.MYSQLDB_HOST,
        user: process.env.MYSQLDB_USER,
        password: process.env.MYSQLDB_PASSWORD,
        port: process.env.MYSQLDB_PORT
    }
)


const pool = createPool({
    host: process.env.MYSQLDB_HOST,
    user: process.env.MYSQLDB_USER,
    password: process.env.MYSQLDB_PASSWORD,
    port: 3306
})

app.get('/', (req, res) => 
    {
    res.send('Hello World!')
    }
)

app.get('/ping', async (req, res) =>
    {
        const result = await pool.query('SELECT NOW()')
        res.json(result[0])
    }
)


app.listen(80)
console.log('Server listening on port 3000')
