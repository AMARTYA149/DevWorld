const express = require('express');
const { userAuth } = require('../middlewares/auth');
const userRouter = express.Router();
const ConnectionRequest = require("../models/connectionRequest.js");
const User = require("../models/user.js");
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
});

userRouter.get("/feed", userAuth, async (req, res) => {

    // LoggedInUser should see all the users except
    // 1. his own profile
    // 2. profiles he accepted
    // 3. profiles he rejected
    // 4. profiles he send request
    try {
        const loggedInUser = req.user;

        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 500 ? 50 : limit;
        const skip = (page - 1) * limit;


        const connectionRequests = await ConnectionRequest.find({
            $or: [{
                fromUserId: loggedInUser._id
            }, {
                toUserId: loggedInUser._id
            }]
        }).select("fromUserId toUserId");
        // .populate("fromUserId", "firstName").populate("toUserId", "firstName");

        const hideUsersFromFeed = new Set();

        connectionRequests.forEach((connections) => {
            hideUsersFromFeed.add(connections.fromUserId.toString());
            hideUsersFromFeed.add(connections.toUserId.toString());
        });

        const users = await User.find({
            $and: [{
                _id: {
                    $nin: Array.from(hideUsersFromFeed)
                }
            }, {
                _id: {
                    $ne: loggedInUser._id
                }
            }]
        }).select(USER_SAFE_DATA).skip(skip).limit(limit);

        res.json({ data: users });

    } catch (error) {
        res.status(400).send("ERROR: " + error.message);
    }
});



module.exports = userRouter;