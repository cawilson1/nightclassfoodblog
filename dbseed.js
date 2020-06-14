require("dotenv").config();
const sql = require("mysql2/promise");

const pool = sql.createPool({
  host: "database-1.ci8zurbwhw4x.us-east-1.rds.amazonaws.com",
  user: "admin",
  password: "password1"
});

(async function testConnection() {
  try {
    const conn = await pool.getConnection();
    console.log("connection created", conn);
    conn.release();
  } catch (error) {
    console.log(error);
  }
})();
