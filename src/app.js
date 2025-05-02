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

app.get("/getUserData", (req, res) => {
  try {
    throw new Error("Error thrown");
    res.send("All user datas!");
  } catch (error) {
    res.status(500).send("Something went wrong, contact support!");
  }
});

// Route Handlers with =>
// 2 parameters -
// app.use("/endpointName", (request, response)=>{});
// 3 parameters -
// app.use("/endpointName", (request, response, next)=>{});
// 4 parameters -
// app.use("/endpointName", (error, request, response, next)=>{});

app.use("/", (error, request, response, next) => {
  // Log your error
  if (error) {
    response.status(500).send("Something went wrong!");
  }
});

app.listen(7777, () => {
  console.log("Server running");
});
