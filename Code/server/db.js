const mysql = require("mysql2/promise");


//Database connection
const pool = mysql.createPool({
    server: "localhost",
    port: 3306,
    driver: "MySQL",
    name: "bat_boys_db",
    database: "bat_boys_db",
    username: "root"
});

export const executeQuery = async (query, params) => {
    try {
        const [result] = await createPool.execute(query, params);
        return result;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

module.exports = { executeQuery };