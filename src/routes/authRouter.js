const express = require("express");
const authRouter = express.Router();
const { validateSignupData } = require("../utils/validation.js");
const bcrypt = require("bcrypt");
const User = require("../models/user.js");

authRouter.post("/signup", async (req, res) => {
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

authRouter.post("/login", async (req, res) => {


  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId });

    if (!user) {
      throw new Error("Invalid Credentials!");
    }

    const isPasswordValid = await user.validatePassword(password);

    if (isPasswordValid) {
      // Create a JWT token

      const token = await user.getJWT(); // generate JWT token of the loggedin user through the _id of the user loggedin

      // Add token to the cookie and send the response back to the client
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
        httpOnly: true,
      });
      res.json({
        data: user,
        message: "Login successful!",


      });
    } else {
      throw new Error("Invalid Credentials!");
    }
  } catch (error) {
    res.status(500).send(`${error}`);
  }
});

authRouter.post("/logout", (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });

  res.send("Logout Successful!");
});

module.exports = authRouter;
