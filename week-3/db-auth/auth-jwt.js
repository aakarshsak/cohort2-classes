const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();

const jwtPassword = "1234567";

const myUser = "aakarsh";

let users = [
  {
    username: "aakarsh",
    password: "123",
  },
];

const userExist = (user) => {
  console.log(user);
  console.log(users);
  const u = users.find(
    (us) => user.username === us.username && user.password === us.password
  );
  if (!u) return false;
  return true;
};

app.use(express.json());

app.post("/login", (req, res) => {
  const user = req.body;

  if (!userExist(user)) {
    res.status(401).send("Invalid cred...");
    return;
  }

  const token = jwt.sign(user.username, jwtPassword);

  res.send(token);
});

app.get("/users", (req, res) => {
  const token = req.headers.authorization;
  console.log(token);
  try {
    const username = jwt.verify(token, jwtPassword);

    const u = users.find((us) => username == us.username);

    if (!u) throw new Error();
  } catch (err) {
    res.status(401).send("Invalid cred...");
    return;
  }

  res.json({ users: [] });
});

app.listen(3000, () => {
  console.log("Listening on port 3000...");
});
