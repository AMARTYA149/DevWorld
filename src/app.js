const express = require("express");
const { adminAuth } = require("../middlewares/auth.js");
const app = express();

// app.use("/admin", adminAuth); //Another way of handling auth middleware

app.get("/admin/getAllUserData", adminAuth, (req, res) => {
  res.send("Get all users data!!!");
});

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
