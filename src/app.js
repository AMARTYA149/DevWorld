const express = require("express");
const connectDB = require("./config/database.js");
const app = express();
const User = require("./models/user.js");
const { validateSignupData } = require("./utils/validation.js");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const JWT_SECRET_WORD = "Dev@World_149";
const { userAuth } = require("./middlewares/auth.js");

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

    // const isPasswordValid = await bcrypt.compare(password, user.password);
    const isPasswordValid = await user.validatePassword(password);

    if (isPasswordValid) {
      // Create a JWT token

      const token = await user.getJWT(); // generate JWT token of the loggedin user through the _id of the user loggedin

      // Add token to the cookie and send the response back to the client
      res.cookie("token", token, {
        expires: new Date(Date.now() + 900000),
        httpOnly: true,
      });
      res.send("Login Successful!");
    } else {
      throw new Error("Invalid Credentials!");
    }
  } catch (error) {
    res.status(500).send(`${error}`);
  }
});

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(500).send("ERROR: " + error.message);
  }
});

app.post("/sendConnectionRequest", userAuth, async (req, res) => {
  const user = req.user;

  res.send(user.firstName + " send the connection request!");
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
