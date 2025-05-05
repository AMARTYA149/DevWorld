const express = require("express");
const connectDB = require("./config/database.js");
const app = express();
const User = require("./models/user.js");
const { validateSignupData } = require("./utils/validation.js");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");

// Route Handlers with =>
// 2 parameters -
// app.use("/endpointName", (request, response)=>{});
// 3 parameters -
// app.use("/endpointName", (request, response, next)=>{});
// 4 parameters -
// app.use("/endpointName", (error, request, response, next)=>{});

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
  try {
    // validation of data
    validateSignupData(req);
    const { firstName, lastName, emailId, password } = req.body;

    // encrypt the password
    const passwordHash = await bcrypt.hash(password, 10);

    // Creating a new instance of the User model
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });
    if (user.skills) {
      user.skills = [...new Set(user.skills.map((item) => item.trim()))];
      if (user.skills.length > 5) {
        throw new Error("Skills can not be more than 5");
      }
    }
    await user.save();
    res.send("User added successfully!");
  } catch (error) {
    res.status(500).send(`${error}`);
  }
});

app.post("/login", async (req, res) => {
  const { emailId, password } = req.body;

  const user = await User.findOne({ emailId });

  try {
    if (!user) {
      throw new Error("Invalid Credentials!");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      // Create a JWT token
      // Add token to the cookie and send the response back to the client
      res.cookie("token", "adsafwefocjwofjweoofwcfwfoiwfhgcnwuiofhehigherg");
      res.send("Login Successful!");
    } else {
      throw new Error("Invalid Credentials!");
    }
  } catch (error) {
    res.status(500).send(`${error}`);
  }
});

app.get("/profile", async (req, res) => {
  const cookie = req.cookies;
  console.log(cookie);

  res.send("Reading cookie");
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
    res.status(500).send("ERROR: " + error.message);
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
    res.status(500).send("ERROR: " + error.message);
  }
});

// Delete a user
app.delete("/user", async (req, res) => {
  try {
    const userId = req.body.userId;

    const user = await User.findByIdAndDelete(userId);
    res.send("User deleted successfully");
  } catch (error) {
    res.status(500).send("ERROR: " + error.message);
  }
});

// Update a user through id using patch http call
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params.userId;
  const data = req.body;
  const ALLOWED_UPDATES = ["photoUrl", "about", "age", "gender", "skills"];

  try {
    const isAllowedUpdate = Object.keys(data).every((item) =>
      ALLOWED_UPDATES.includes(item)
    );

    if (!isAllowedUpdate) {
      throw new Error("Update not allowed!");
    }

    if (data.skills) {
      data.skills = [...new Set(data.skills.map((item) => item.trim()))];
      if (data.skills.length > 5) {
        throw new Error("Skills can not be more than 5");
      }
    }

    const user = await User.findByIdAndUpdate({ _id: userId }, data, {
      returnDocument: "before",
      runValidators: true,
    });

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
//     res.status(500).send("ERROR: " + error.message);
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
