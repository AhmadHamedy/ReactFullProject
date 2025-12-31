require("dotenv").config();
const mysql = require("mysql2");

// This matches the variable names in your .env file
const urlDB = `mysql://${process.env.MYSQLUSER}:${process.env.MYSQLPASSWORD}@${process.env.MYSQLHOST}:${process.env.MYSQLPORT}/${process.env.MYSQLDATABASE}`;

const connection = mysql.createConnection(urlDB);

module.exports = connection;