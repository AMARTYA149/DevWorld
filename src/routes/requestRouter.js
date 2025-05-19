const express = require("express");
const { userAuth } = require("../middlewares/auth.js");

const requestRouter = express.Router();

requestRouter.post("/request/send/interested/:toUserId", userAuth, async (req, res) => {

  try {
    const fromUserId = req.user._id;
  } catch (error) {

    res.send(user.firstName + " send the connection request!");
  }
});

module.exports = requestRouter;
