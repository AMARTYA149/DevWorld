const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
    {
        fromUserId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        toUserId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        status: {
            type: String,
            required: true,
            enum: {
                values: ["ignored", "interested", "accepted", "rejected"],
                message: `{VALUE} is incorrected status type`
            }
        }
    },
    { timestamps: true }
);

// Compound Index to find the connectionRequest between fromUserId & toUserId fastly
connectionRequestSchema.index({
    fromUserId: 1, toUserId: 1
});

// SCHEMA VALIDATION - pre level validation (Pre-hook middleware)
connectionRequestSchema.pre("save", function (next) {
    const connectionRequest = this;

    if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
        throw new Error("Cannot send request to yourself!");
    }

    next();
})

const ConnectionRequestModel = new mongoose.model("ConnectionRequest", connectionRequestSchema);

module.exports = ConnectionRequestModel

