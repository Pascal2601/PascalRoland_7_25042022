const mysql = require("mysql2");
const dotenv = require("dotenv").config();

// Create the connection pool. The pool-specific settings are the defaults
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_BASE,
  password: process.env.DB_PASS,
});

module.exports = pool.promise(console.log("Connexion DB"));
