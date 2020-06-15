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
        request.body.bio ? request.body.bio : null
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

app.put("/user", authorizeUser, async (request, response) => {
  try {
    console.log("PUT USER");
    if (!request.body.username) {
      response.status(400).send({ message: "no username entered" });
    }

    const selectQuery = await pool.execute(
      `SELECT * FROM foodblog.user WHERE username = ?`,
      [request.body.username]
    );

    console.log(selectQuery[0][0]);
    const selectedUser = selectQuery[0][0];
    const conn = await pool.getConnection();
    const queryResponse = await conn.execute(
      `UPDATE foodblog.user SET username = ?, profilepic = ?, bio = ? WHERE username = ?`,
      [
        request.body.username,
        request.body.profilepic
          ? request.body.profilepic
          : selectedUser.profilepic,
        request.body.bio ? request.body.bio : selectedUser.bio,
        request.body.username
      ]
    );
    conn.release();
    console.log(queryResponse);
    response.status(200).send({ message: queryResponse });
  } catch (error) {
    console.log(error);
    response.status(500).send({ message: error });
  }
});

app.get("/user", authorizeUser, async (request, response) => {
  try {
    console.log("GET ONE USER");
    const conn = await pool.getConnection();
    const recordset = await conn.execute(
      `SELECT * FROM foodblog.user WHERE username = ?`,
      [request.query.username]
    );
    conn.release();
    console.log(recordset[0]);
    response.status(200).send({ message: recordset[0] });
  } catch (error) {
    console.log(error);
    response.status(500).send({ message: error });
  }
});

app.delete("/user", authorizeUser, async (request, response) => {
  try {
    console.log("DELETE ONE USER");
    const conn = await pool.getConnection();
    const recordset = await conn.execute(
      `DELETE FROM foodblog.user WHERE username = ?`,
      [request.body.username]
    );
    conn.release();
    console.log(recordset[0]);
    response.status(200).send({ message: recordset[0] });
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

app.post("/foodblogpost", authorizeUser, async (request, response) => {
  try {
    console.log("POST FOOD BLOGPOST");
    if (!request.body.username) {
      response.status(400).send({ message: "this blogpost has no user" });
    }
    const conn = await pool.getConnection();
    const queryResponse = await conn.execute(
      `INSERT INTO foodblog.foodblogpost (username,title,description,date) VALUES (?, ?, ?, ?)`,
      [
        request.body.username,
        request.body.title ? request.body.title : null,
        request.body.description ? request.body.description : null,
        new Date()
      ]
    );
    conn.release();
    console.log(queryResponse);
    response.status(200).send({ message: queryResponse });
  } catch (error) {
    console.log(error);
    response.status(500).send({ message: error });
  }
});

app.get("/foodblogposts", authorizeUser, async (request, response) => {
  try {
    console.log("GET ALL foodblogposts");
    const conn = await pool.getConnection();
    const recordset = await conn.query(
      `SELECT * FROM foodblog.foodblogpost`
      //   `SELECT date, bio, users.username FROM foodblog.user users JOIN foodblog.foodblogpost foodposts ON users.username = foodposts.username`
    );
    conn.release();
    console.log(recordset[0]);
    response.status(200).send({ message: recordset[0] });
  } catch (error) {
    console.log(error);
    response.status(500).send({ message: error });
  }
});

app.get("/foodblogpost", authorizeUser, async (request, response) => {
  try {
    console.log("GET ONE BLOGPOST");
    const conn = await pool.getConnection();
    const recordset = await conn.execute(
      `SELECT * FROM foodblog.foodblogpost WHERE id = ?`,
      [request.query.blogPostId]
    );
    conn.release();
    console.log(recordset[0]);
    response.status(200).send({ message: recordset[0] });
  } catch (error) {
    console.log(error);
    response.status(500).send({ message: error });
  }
});

app.delete("/foodblogpost", authorizeUser, async (request, response) => {
  try {
    console.log("DELETE ONE FOOD BLOGPOST");
    const conn = await pool.getConnection();
    const recordset = await conn.execute(
      `DELETE FROM foodblog.foodblogpost WHERE id = ?`,
      [request.body.blogPostId]
    );
    conn.release();
    console.log(recordset[0]);
    response.status(200).send({ message: recordset[0] });
  } catch (error) {
    console.log(error);
    response.status(500).send({ message: error });
  }
});

app.put("/foodblogpost", authorizeUser, async (request, response) => {
  try {
    console.log("PUT FOOD BLOGPOST");
    if (!request.body.blogPostId) {
      response.status(400).send({ message: "no valid blog id entered" });
    }

    const selectQuery = await pool.execute(
      `SELECT * FROM foodblog.foodblogpost WHERE id = ?`,
      [request.body.blogPostId]
    );

    console.log(selectQuery[0][0]);
    const selectedBlogPost = selectQuery[0][0];
    const conn = await pool.getConnection();
    const queryResponse = await conn.execute(
      `UPDATE foodblog.foodblogpost SET title = ?, description = ?, date = ? WHERE id = ?`,
      [
        request.body.title ? request.body.title : selectedBlogPost.title,
        request.body.description
          ? request.body.description
          : selectedBlogPost.description,
        new Date(),
        request.body.blogPostId
      ]
    );
    conn.release();
    console.log(queryResponse);
    response.status(200).send({ message: queryResponse });
  } catch (error) {
    console.log(error);
    response.status(500).send({ message: error });
  }
});

app.post("/foodblogpic", authorizeUser, async (request, response) => {
  try {
    console.log("POST FOOD PICTURE");
    if (!request.body.s3uuid || !request.body.foodblogpost) {
      response.status(400).send({ message: "this blogpic is missing params" });
    }
    const conn = await pool.getConnection();
    const queryResponse = await conn.execute(
      `INSERT INTO foodblog.foodblogpic (s3uuid,description,foodblogpost) VALUES (?, ?, ?)`,
      [
        request.body.s3uuid,
        request.body.description ? request.body.description : null,
        request.body.foodblogpost
      ]
    );
    conn.release();
    console.log(queryResponse);
    response.status(200).send({ message: queryResponse });
  } catch (error) {
    console.log(error);
    response.status(500).send({ message: error });
  }
});

app.get("/foodblogpics", authorizeUser, async (request, response) => {
  try {
    console.log("GET ALL foodblogpics");
    const conn = await pool.getConnection();
    const recordset = await conn.query(
      `SELECT * FROM foodblog.foodblogpic`
      //   `SELECT date, bio, users.username FROM foodblog.user users JOIN foodblog.foodblogpost foodposts ON users.username = foodposts.username`
    );
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
