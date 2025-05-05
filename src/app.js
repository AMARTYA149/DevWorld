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

app.use(express.json());

app.post("/signup", async (req, res) => {
  //Creating a new instance of the User model
  const user = new User(req.body);

  try {
    await user.save();
    res.send("User added successfully!");
  } catch (error) {
    res.status(500).send(`Error saving user: ${error}`);
  }
});

// Get user by email
app.get("/user", async (req, res) => {
  const userEmailID = req.body.emailId;
  try {
    const users = await User.find({ emailId: userEmailID });

    if (users.length === 0) {
      res.status(404).send("User not found!");
    } else {
      res.send(users);
    }
  } catch (error) {
    res.status(500).send("Something went wrong!");
  }
});

// Feed API - get all users
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});

    if (users.length === 0) {
      res.status(404).send("No users found!");
    } else {
      res.send(users);
    }
  } catch (error) {
    res.status(500).send("Something went wrong!");
  }
});

// Delete a user
app.delete("/user", async (req, res) => {
  try {
    const userId = req.body.userId;

    const user = await User.findByIdAndDelete(userId);
    res.send("User deleted successfully");
  } catch (error) {
    res.status(500).send("Something went wrong!");
  }
});

// Update a user through id using patch http call
app.patch("/user", async (req, res) => {
  try {
    const userId = req.body.userId;
    const data = req.body;
    const user = await User.findByIdAndUpdate({ _id: userId }, data, {
      returnDocument: "before",
      runValidators: true,
    });
    console.log("Older User: ", user);
    res.send("User updated successfully");
  } catch (error) {
    res.status(500).send(`UPDATE FAILED! ${error.message}`);
  }
});

// Update a user through email and patch http call
// app.patch("/updateUserByEmail", async (req, res) => {
//   try {
//     const userEmail = req.body.emailId;
//     const userData = req.body;
//     const user = await User.find({ emailId: userEmail }).updateOne(userData);
//     res.send("User updated successfully by email!");
//   } catch (error) {
//     res.status(500).send("Something went wrong!");
//   }
// });

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
