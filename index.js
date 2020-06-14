const { DB_HOST, DB_PASSWORD, DB_USER } = require("./creds");
const express = require("express");
const sql = require("mysql2/promise");
const cors = require("cors");

const PORT = 4000;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const pool = sql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD
});

// 'asasasdfasdfasdf' OR 1 = 1 DROP TABLE bankaccountinfo --
// `SELECT * FROM bankaccountinfo WHERE username = ${request.body.username} INNER JOIN asdfasdf SELECTI`
// `SELECT * FROM bankaccountinfo WHERE username = 'asasasdfasdfasdf' OR 1 = 1 DROP TABLE bankaccountinfo -- INNER JOIN asdfasdf SELECTI`

app.post("/user", authorizeUser, async (request, response) => {
  try {
    console.log("POST USER");
    if (!request.body.username) {
      response.status(400).send({ message: "no username entered" });
    }
    const conn = await pool.getConnection();
    const queryResponse = await conn.execute(
      `INSERT INTO foodblog.user (username, profilepic, bio) VALUES (?, ?, ?)`,
      [
        request.body.username,
        request.body.profilepic ? request.body.profilepic : null,
        request.body.bio ? request.body.profilepic : null
      ]
    );

    //dont do it this way unless you want a sql injection attack
    // const queryResponse = await conn.query(
    //   `INSERT INTO foodblog.user (username, profilepic, bio) VALUES (${request.body.username},${request.body.profilepic},${request.body.bio})`
    // );
    conn.release();
    console.log(queryResponse);
    response.status(200).send({ message: queryResponse });
  } catch (error) {
    console.log(error);
    response.status(500).send({ message: error });
  }
});

app.get("/users", authorizeUser, async (request, response) => {
  try {
    console.log("GET ALL USERS");
    const conn = await pool.getConnection();
    const recordset = await conn.query(`SELECT * FROM foodblog.user`);
    conn.release();
    console.log(recordset[0]);
    response.status(200).send({ message: recordset[0] });
  } catch (error) {
    console.log(error);
    response.status(500).send({ message: error });
  }
});

function authorizeUser(request, response, next) {
  next();
}

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
