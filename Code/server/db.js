const mysql = require("mysql2");
const fs = require("fs");
const path = require("path");
require('dotenv').config();

//Check if the environment is test
const isTestEnv = process.env.NODE_ENV === 'test';

//Database connection
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: process.env.DB_PASSWORD,
    database: "bat_boys_db",
    
});

if (isTestEnv) {
    const sqlFilePath = path.join(__dirname, '../db/bat_boys_db.session.sql');

    try {
        const sql = fs.readFileSync(sqlFilePath, "utf8");
        const commands = sql.split(";").filter(cmd => cmd.trim());

        commands.forEach((command) => {
            connection.query(command, (err, result) => {
                if (err) throw err;
                console.log("Tables created");
            });
        });
    } catch (err) {
        console.log(err);
    }
}

module.exports = connection;