const express = require('express');
const { userAuth } = require('../middlewares/auth');
const userRouter = express.Router();
const ConnectionRequest = require("../models/connectionRequest.js");
const USER_SAFE_DATA = "firstName lastName photoUrl skills about age gender";


userRouter.get("/user/requests/received", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate("fromUserId", USER_SAFE_DATA);
        // }).populate("fromUserId", ["firstName", "lastName", "photoUrl", "skills", "about"]);


        res.json({
            message: "Data fetched successfully!",
            data: connectionRequests
        });
    } catch (error) {
        res.status(400).send("ERROR: " + error.message);

    }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequest.find({
            $or: [
                { toUserId: loggedInUser._id, status: "accepted" },
                {
                    fromUserId: loggedInUser._id, status: "accepted"
                }
            ]
        }).populate("fromUserId", USER_SAFE_DATA).populate("toUserId", USER_SAFE_DATA);

        const data = connectionRequests.map((document) => {
            if (document.fromUserId._id.toString() === loggedInUser._id.toString()) {
                return document.toUserId;
            }
            return document.fromUserId;
        })

        res.json({
            message: "Data fetched successfully!",
            data: data
        });
    } catch (error) {
        res.status(400).send("ERROR: " + error.message);
    }
})

module.exports = userRouter;