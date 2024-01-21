import { log } from 'console'

const { Pool } = require('pg')

const DbConfig = {
    user: 'kfzeowhf',
    host: 'isabelle.db.elephantsql.com',
    database: 'kfzeowhf',
    password: '1cHLKFqATJNuF7hUDY70d2y87bIBU24h',
    port: 5432
}

export async function executeSQL(sqlScript) {

    try {
        const pool = new Pool(DbConfig)
        const client = await pool.connect()

        const result = await client.query(sqlScript)
        console.log(result.rows)

    } catch(error) {
        console.log('Erro ao executar SQL ' + error);
    }

    
}