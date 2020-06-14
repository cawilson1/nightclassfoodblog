require("dotenv").config();
const sql = require("mysql2/promise");
const { DB_HOST, DB_PASSWORD, DB_USER } = require("./creds");

const pool = sql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD
});

(async function createUserTable() {
  try {
    const conn = await pool.getConnection();

    console.log("connection successful", conn);

    conn.release();
  } catch (error) {
    console.log(error);
  }
})();

// (async function createUserTable() {
//   try {
//     const conn = await pool.getConnection();

//     conn.query("CREATE DATABASE IF NOT EXISTS foodblog");
//     conn.query("USE foodblog");

//     const userDb = await conn.query(
//       "CREATE TABLE IF NOT EXISTS user (username VARCHAR(255) UNIQUE NOT NULL, profilepic VARCHAR(255), bio VARCHAR (3000), PRIMARY KEY(username) )"
//     );
//     console.log(userDb);

//     conn.release();
//   } catch (error) {
//     console.log(error);
//   }
// })();

// (async function createBlogPostTable() {
//   try {
//     const conn = await pool.getConnection();

//     conn.query("USE foodblog");

//     const foodblogpostDb = await conn.query(
//       "CREATE TABLE IF NOT EXISTS foodblogpost (id INT UNIQUE NOT NULL AUTO_INCREMENT, title VARCHAR(255), description VARCHAR(4095), username VARCHAR(255) NOT NULL, date DATETIME NOT NULL, PRIMARY KEY(id), FOREIGN KEY(username) REFERENCES user(username)  )"
//     );
//     console.log(foodblogpostDb);

//     conn.release();
//   } catch (error) {
//     console.log(error);
//   }
// })();

// (async function createBlogPicTable() {
//   try {
//     const conn = await pool.getConnection();

//     conn.query("USE foodblog");

//     const foodblogpicDb = await conn.query(
//       "CREATE TABLE IF NOT EXISTS foodblogpic (s3uuid VARCHAR(255) NOT NULL UNIQUE, description VARCHAR(4095), foodblogpost INT NOT NULL, PRIMARY KEY(s3uuid), FOREIGN KEY(foodblogpost) REFERENCES foodblogpost(id)  )"
//     );
//     console.log(foodblogpicDb);

//     conn.release();
//   } catch (error) {
//     console.log(error);
//   }
// })();
