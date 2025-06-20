const cron = require("node-cron");
const ConnectionRequestModel = require("../models/connectionRequest");

cron.schedule("* * * * * *", () => {
    // Send email to all people who have received requests the previous day
    try {
        const yesterday = new Date();
        const pendingRequests = await ConnectionRequestModel.find({
            status: interested,
            createdAt: 
        })
    } catch (err) {

    }
})