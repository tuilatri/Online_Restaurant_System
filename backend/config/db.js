const sql = require('mssql');

const dbConfig = {
  user: process.env.MSSQL_USER,
  password: process.env.MSSQL_PASSWORD,
  database: process.env.MSSQL_DATABASE,
  server: process.env.MSSQL_SERVER,
  port: parseInt(process.env.MSSQL_PORT),
  options: {
    encrypt: false, // Use false for localhost
    trustServerCertificate: true // Use true for local dev
  }
};

module.exports = dbConfig;