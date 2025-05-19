const express = require("express");
const { userAuth } = require("../middlewares/auth.js");
const {
  validateEditProfileData,
  validateCurrentPassword,
} = require("../utils/validation.js");
const bcrypt = require("bcrypt");
const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(500).send("ERROR: " + error.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid edit request!");
    }
    const loggedInUser = req.user;

    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

    await loggedInUser.save();

    res.json({
      message: `${loggedInUser.firstName}, your profile has been updated successfully!`,
      data: loggedInUser,
    });
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

profileRouter.patch("/profile/updatePassword", userAuth, async (req, res) => {
  try {
    if (!validateCurrentPassword(req)) {
      throw new Error("Invalid current password!");
    }

    if (req.body.newPassword !== req.body.reEnterNewPassword) {
      throw new Error("Passwords are not matching!");
    }

    const { newPassword } = req.body;

    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    const loggedInUser = req.user;

    loggedInUser.password = newPasswordHash;
    await loggedInUser.save();

    res.json({
      message: `${loggedInUser.firstName}, your password is updated!`,
    });
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

module.exports = profileRouter;
