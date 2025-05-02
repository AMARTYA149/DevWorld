const express = require("express");

const app = express();

app.get(
  "/user",
  (req, res, next) => {
    console.log("Handling route handler 1");
    next();
  },
  [
    (req, res, next) => {
      console.log("Handling route handler 2");
      next();
    },
    (req, res, next) => {
      console.log("Handling route handler 3");
      next();
    },
  ],
  (req, res, next) => {
    console.log("Handling route handler 4");
    res.send("4th Response");
  }
);

app.listen(7777, () => {
  console.log("Server running");
});
