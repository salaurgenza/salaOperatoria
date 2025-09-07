import mysql from "mysql2/promise";

export const pool = mysql.createPool({
    host: "localhost",   // cambia se usi un altro server
    user: "root",        // il tuo utente MySQL
    password: "password",// la tua password MySQL
    database: "sala_operatoria",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
