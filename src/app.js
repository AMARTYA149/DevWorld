const express = require("express");
const connectDB = require("./config/database.js");
const app = express();
const User = require("./models/user.js");

// Route Handlers with =>
// 2 parameters -
// app.use("/endpointName", (request, response)=>{});
// 3 parameters -
// app.use("/endpointName", (request, response, next)=>{});
// 4 parameters -
// app.use("/endpointName", (error, request, response, next)=>{});

app.post("/signup", async (req, res) => {
  //Creating a new instance of the User model
  const user = new User({
    firstName: "Swati",
    lastName: "Rani",
    emailId: "swati@rani.in",
    password: "Swati@123",
  });

  try {
    await user.save();
    res.send("User added successfully!");
  } catch (error) {
    res.status(400).send("Error saving user: ", error.message);
  }
});

connectDB()
  .then(() => {
    console.log("Database connected successfully!");
    app.listen(7777, () => {
      console.log("Server running on port 7777!");
    });
  })
  .catch((err) => {
    console.error("Database cannot be connected!");
  });
