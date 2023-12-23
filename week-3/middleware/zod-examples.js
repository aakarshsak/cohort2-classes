const express = require("express");
const zod = require("zod");

const schema = zod.object({
  email: zod.string().email(),
  password: zod.string().min(10),
  age: zod.number().min(18),
  language: zod.literal("IN").or(zod.literal("US")),
});

const app = express();

app.use(express.json());

const inputValidation = (req, res, next) => {
  const body = req.body;
  const response = schema.safeParse(body);

  if (!response || !response.success) {
    res.status(411).send({ err: "Invalid Input given..." });
    return;
  }

  req.response = response;

  next();
};

app.use(inputValidation);

app.get("/signup", (req, res) => {
  res.send({ respones: req.response });
});

app.listen(3000, () => {
  console.log("Listening on port 3000....");
});
