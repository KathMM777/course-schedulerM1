require('dotenv').config()             // loads server/.env into process.env
const mysql = require('mysql2/promise') // the promise version, so we can use async/await

const pool = mysql.createPool({        // one shared pool of connections for the whole app
    host: process.env.DB_HOST,           // credentials come from .env, never hardcoded
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
})

module.exports = pool                  // routes import this instead of making their own connections