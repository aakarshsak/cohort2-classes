const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const jwtPassword = "12345667";

mongoose.connect("mongodb://127.0.0.1:27017/cohort2");

const app = express();

const User = mongoose.model("Users", {
  name: String,
  email: String,
  password: String,
});

app.use(express.json());

app.post("/signup", async (req, res) => {
  const user = req.body;

  const userFind = await User.findOne({ email: user.email });
  if (userFind) {
    res.status(401).send("User already exist...");
    return;
  }

  const data = new User(user);
  data.save();

  res.send(data);
});

app.post("/signin", async (req, res) => {
  const user = req.body;

  const userFind = await User.findOne({
    email: user.email,
    password: user.password,
  });
  if (!userFind) {
    res.status(401).send("Invalid cred...");
    return;
  }
  console.log(user.email);
  const token = jwt.sign({ username: user.email }, jwtPassword);

  res.send(token);
});

app.get("/users", async (req, res) => {
  const token = req.headers.authorization;
  console.log(token);
  let loggedInUser;
  try {
    const decode = jwt.verify(token, jwtPassword);

    console.log(decode);
    const user = await User.findOne({ email: decode.username });

    if (!user) {
      throw new Error();
    }
    loggedInUser = user;
  } catch (err) {
    res.status(401).send("Invalid token cred...");
    return;
  }

  const users = await User.find();

  res.json(users.filter((u) => loggedInUser.email !== u.email));
});

app.listen(3000, () => console.log("Listening on port 3000"));
