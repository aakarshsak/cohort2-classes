const express = require("express");

const app = express();

let numberOfRequests = 0;

const calculateRate = (req, res, next) => {
  numberOfRequests++;
  console.log(numberOfRequests);
  next();
};

let startTime;
let endTime;

const startTimeMiddleware = (req, res, next) => {
  startTime = Date.now();
  console.log("Inside Start Timer", startTime);
  next();
};

const endTimeMiddleware = (req, res, next) => {
  endTime = Date.now();
  console.log("Time Taken : ", (endTime - startTime) / 1000);
  next();
};

app.use(calculateRate);

app.get(
  "/health-checkup",
  (req, res, next) => {
    const username = req.headers.username;
    const password = req.headers.password;

    if (username !== "aakarsh" || password !== "sinha") {
      res.status(401).send("Invalid cred...");
      return;
    }
    console.log("Insiiiide Auth....");
    next();
  },
  (req, res, next) => {
    const kidneyId = req.query.id;

    if (kidneyId > 2 || kidneyId < 1) {
      res.status(411).send("Invvvvalid input...");
      return;
    }
    console.log("Inside Kidney check....");
    next();
  },
  startTimeMiddleware,
  (req, res, next) => {
    res.status(200).send("You are healthy...");
    next();
  },
  endTimeMiddleware
);

app.listen(3000, () => {
  console.log("Listening on port 3000....");
});
