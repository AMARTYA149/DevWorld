const express = require("express");

const app = express();

app.get(
  "/user",
  (req, res, next) => {
    console.log("Handling route handler 1");
    // res.send("1st Response");
    next();
  },
  [
    (req, res, next) => {
      console.log("Handling route handler 2");
      //   res.send("2nd Response");
      next();
    },
    (req, res, next) => {
      console.log("Handling route handler 3");
      //   res.send("3th Response");
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
