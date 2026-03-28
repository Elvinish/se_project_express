const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const { errors } = require("celebrate");
const mainRouter = require("./routes/index");
const errorHandler = require("./middlewares/error-handler");

const { requestLogger, errorLogger } = require("./middlewares/logger");

const app = express();
// const { PORT = 3001 } = process.env;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((error) => {
    console.log("DB Connection Error:", error);
  });

app.use(requestLogger);
app.use(cors());
app.use(express.json());

app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

app.use("/", mainRouter);
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

module.exports = app;
