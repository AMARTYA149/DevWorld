const express = require("express");
const { userAuth } = require("../middlewares/auth.js");
const ConnectionRequest = require("../models/connectionRequest.js");
const User = require("../models/user.js");
const requestRouter = express.Router();
const mongoose = require("mongoose");


requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {

  try {
    const fromUserId = req.user._id;
    const {
      toUserId, status
    } = req.params;

    const allowedStatus = ["ignored", "interested"];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        message: "Invalid status type: " + status
      });
    }

    const toUser = await User.findById(toUserId);
    if (!toUser) {
      return res.status(404).json({
        message: "User not found!"
      })
    }

    const connectionRequest = new ConnectionRequest({
      fromUserId, toUserId, status
    });

    // check if there is an existing connectionRequest
    const existingConnectionRequest = await ConnectionRequest.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId }
      ]
    });

    if (existingConnectionRequest) {
      return res.status(400).send({
        message: "Connection request already exists!"
      })
    }



    const data = await connectionRequest.save();

    res.json({
      message: `Connection ${status} successfully`,
      data
    })

  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
  try {
    // Babita=>Jay
    // loggedInUser == toUserId
    // status ===  interested
    // requestId should be valid
    const loggedInUser = req.user;
    const { status, requestId } = req.params;
    const allowedStatus = ["accepted", "rejected"];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        message: "Status not allowed!"
      });
    }

    if (!mongoose.Types.ObjectId.isValid(requestId)) {
      return res.status(400).json({ message: "Invalid request ID" });
    }

    const connectionRequest = await ConnectionRequest.findOne({
      _id: requestId,
      status: "interested",
      toUserId: loggedInUser._id
    });

    if (!connectionRequest) {
      return res.status(404).json({ message: "Connection request not found!" });
    }

    connectionRequest.status = status;
    const data = await connectionRequest.save();

    res.json({
      message: `Connection request ${status}`,
      data
    });

  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
})

module.exports = requestRouter;
