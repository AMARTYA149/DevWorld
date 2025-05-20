const express = require("express");
const { userAuth } = require("../middlewares/auth.js");
const ConnectionRequestModel = require("../models/connectionRequest.js");
const User = require("../models/user.js");
const requestRouter = express.Router();

requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {

  try {
    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;

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

    const connectionRequest = new ConnectionRequestModel({
      fromUserId, toUserId, status
    });

    // check if there is an existing connectionRequest
    const existingConnectionRequest = await ConnectionRequestModel.findOne({
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

module.exports = requestRouter;
