require("dotenv").config();
const sql = require("mysql2/promise");

const pool = sql.createPool({
  host: "database-1.ci8zurbwhw4x.us-east-1.rds.amazonaws.com",
  user: "admin",
  password: "password1"
});

(async function createUserTable() {
  try {
    const conn = await pool.getConnection();

    conn.query("CREATE DATABASE IF NOT EXISTS foodblog");
    conn.query("USE foodblog");

    const userDb = await conn.query(
      "CREATE TABLE IF NOT EXISTS user (username VARCHAR(255) UNIQUE NOT NULL, profilepic VARCHAR(255), bio VARCHAR (3000), PRIMARY KEY(username) )"
    );
    console.log(userDb);

    conn.release();
  } catch (error) {
    console.log(error);
  }
})();
