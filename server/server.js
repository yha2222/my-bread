const express = require("express");
const cors = require("cors");
const session = require("express-session");
const mysql = require("mysql2");
const db = mysql.createPoolCluster();

const app = express();
const port = 4000;

app.use(express.json());
app.use(
  session({
    secret: "SECRET",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

db.add("my-bread", {
  host: "127.0.0.1",
  user: "root",
  password: "",
  database: "my-bread",
  port: 3306,
});

function 디비실행(query) {
  return new Promise(function (resolve, reject) {
    db.getConnection("my-bread", function (error, connection) {
      if (error) {
        console.log("디비 연결 오류", error);
        reject(true);
      }

      connection.query(query, function (error, data) {
        if (error) {
          console.log("쿼리 오류", error);
          reject(true);
        }

        resolve(data);
      });

      connection.release();
    });
  });
}

app.get("/myBread", async (req, res) => {
  const query = `SELECT * FROM myBread, user WHERE myBread.id = user.id`;

  const mybread = await 디비실행(query);

  res.send(mybread);
});

app.get("/article_row", async (req, res) => {
  const { seq } = req.query;

  const query = `SELECT * FROM article WHERE seq = '${seq}'`;
  const article = await 디비실행(query);

  const reply_query = `SELECT * FROM reply WHERE seq = '${seq}'`;
  const reply = await 디비실행(reply_query);

  res.send({
    article: article[0],
    reply: reply,
  });
});

app.get("/article", async (req, res) => {
  const query = `SELECT * FROM article, user WHERE article.user_seq = user.seq`;

  const article = await 디비실행(query);

  res.send(article[0]);
});

app.get("/", (req, res) => {
  res.send("메인페이지");
});

app.post("/autoLogin", (req, res) => {
  res.send(req.session.loginUser);
});

app.post("/login", async (req, res) => {
  const { id, pw } = req.body;

  const result = {
    code: "success",
    message: "로그인 되었습니다",
  };

  if (id === "") {
    result.code = "fail";
    result.message = "아이디를 입력해주세요";
  }
  if (pw === "") {
    result.code = "fail";
    result.message = "비밀번호를 입력해주세요";
  }

  const user = await 디비실행(
    `SELECT * FROM user WHERE id='${id}' AND password='${pw}'`
  );

  if (user.length === 0) {
    result.code = "fail";
    result.message = "아이디가 존재하지 않습니다.";
  }

  if (result.code === "fail") {
    res.send(result);
    return;
  }

  req.session.loginUser = user[0];
  req.session.save();

  res.send(result);
});

app.post("/join", async (req, res) => {
  const { id, nickname, pw } = req.body;

  const result = {
    code: "success",
    message: "회원가입 되었습니다.",
  };

  if (id === "") {
    result.code = "fail";
    result.message = "아이디를 입력해주세요";
  }
  if (pw === "") {
    result.code = "fail";
    result.message = "비밀번호를 입력해주세요";
  }

  const user = await 디비실행(`SELECT * FROM user WHERE id='${id}'`);

  if (user.length > 0) {
    result.code = "fail";
    result.message = "이미 동일한 아이디가 존재합니다.";
  }

  if (result.code === "fail") {
    res.send(result);
    return;
  }

  await 디비실행(
    `INSERT INTO user(id, password, nickname) VALUES('${id}', '${pw}', '${nickname}')`
  );

  res.send(result);
});

app.post("/write", async (req, res) => {
  const { title, body } = req.body;
  const { loginUser } = req.session;

  const result = {
    code: "success",
    message: "작성되었습니다.",
  };

  if (title === "") {
    result.code = "fail";
    result.message = "제목을 작성해주세요";
  }
  if (body === "") {
    result.code = "fail";
    result.message = "내용을 작성해주세요.";
  }
  if (result.code === "fail") {
    res.send(result);
    return;
  }

  const query = `INSERT INTO article(title, body, user_seq) VALUES('${title}','${body}','${loginUser.seq}')`;

  await 디비실행(query);

  res.send(result);
});

app.post("/reply", async (req, res) => {
  const { loginUser } = req.session;
  const { replyText, seq } = req.body;
  const result = {
    code: "success",
    message: "댓글이 작성되었습니다.",
  };

  if (replyText === "") {
    result.code = "error";
    result.message = "댓글을 입력해주세요.";
  }

  if (result.code === "error") {
    res.send(result);
    return;
  }

  const query = `INSERT INTO reply(body, seq, user_seq) VALUE('${replyText}', '${seq}', '${loginUser.seq}')`;

  await 디비실행(query);

  res.send(result);
});

app.listen(port, () => {
  console.log("서버가 시작되었습니다.");
});
