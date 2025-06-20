const cron = require("node-cron");
const ConnectionRequestModel = require("../models/connectionRequest");
const { subDays, startOfDay, endOfDay } = require("date-fns");
const sendEmail = require("./sendEmail");

cron.schedule("0 9 * * *", async () => { // this job will run 9am every morning
    // Send email to all people who have received requests the previous day
    console.log("Cron job");
    try {
        const yesterday = subDays(new Date(), 1);
        const yesterdayStart = startOfDay(yesterday);
        const yesterdayEnd = endOfDay(yesterday);

        const pendingRequestsOfYesterday = await ConnectionRequestModel.find({
            status: "interested",
            createdAt: {
                $gte: yesterdayStart,
                $lt: yesterdayEnd
            }
        }).populate("fromUserId toUserId");

        const listOfEmails = [...new Set(pendingRequestsOfYesterday.map(req => req.toUserId.emailId))];

        for (const email of listOfEmails) {
            // Send Emails
            try {
                const res = await sendEmail.run("New friend requests received for " + email, "New friends are waiting to connect to you @ DevWorld!");


            } catch (error) {
                console.log("Error fetching email id");
            }
        }
    } catch (err) {
        console.log("Error occured");
    }
})