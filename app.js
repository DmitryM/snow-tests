const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");

const port = process.env.PORT || 3001;

const sign_key = "SECRET";

const verifyToken = (req, res, next) => {
  const token =
    req.query.token || req.headers["authorization"];

  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }

  try {
    const decoded = jwt.verify(token, sign_key);
    req.user = decoded;
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }

  return next();
};

app.get("/", (req, res) => res.type('html').send('test'));

app.post("/login", express.urlencoded(), (req, res) => {
  try {
    const { username, password } = req.body;

    if (!(username && password)) {
      res.status(400).send("All input is required");
    }

    if (username == "test" && password == "test") {
      let result = {};

      const token = jwt.sign(
        { user_id: 123 },
        sign_key,
        {
          expiresIn: "5m",
        }
      );

      result.access = token;

      // user
      res.status(200).json(result);
    }
  
    res.status(400).send("Invalid Credentials");
  } catch (err) {
    console.log(err);
  }
});

const server = app.listen(port, () => console.log(`Example app listening on port ${port}!`));

server.keepAliveTimeout = 120 * 1000;
server.headersTimeout = 120 * 1000;