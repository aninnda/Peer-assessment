const mysql = require("mysql2");
const fs = require("fs");
const path = require("path");

//Database connection
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Samy1445",
    database: "bat_boys_db",
    
});

const sqlFilePath = path.join(__dirname, '../db/bat_boys_db.session.sql');

try {
    const sql = fs.readFileSync(sqlFilePath, "utf8");
    const commands = sqlContent.split(";").filter(cmd => cmd.trim());

    commands.forEach((command) => {
        connection.query(command, (err, result) => {
            if (err) throw err;
            console.log("Tables created");
        });
    });
} catch (err) {
    console.log(err);
}


module.exports = connection;