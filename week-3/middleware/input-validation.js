const express = require("express");

const app = express();

app.use(express.json());

const inputValidation = (req, res, next) => {
  const kidneyId = req.query.id;
  if (!kidneyId || isNaN(kidneyId)) throw Error();

  console.log(kidneyId);
  if (kidneyId > 2 || kidneyId < 1) {
    res.status(411).send("Invalid input...");
    return;
  }
  console.log("Inside Kidney check....");
  next();
};

const exceptionHandler = (err, req, res, next) => {
  res.status(500).send("Internal Server Errror...");
};

app.use(inputValidation);

app.get("/health-checkup", (req, res, next) => {
  res.status(200).send("You are healthy...");
  next();
});

app.use(exceptionHandler); //global catched....

app.listen(3000, () => {
  console.log("Listening on port 3000....");
});
