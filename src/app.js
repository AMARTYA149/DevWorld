const express = require("express");
const connectDB = require("./config/database.js");
const app = express();
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/authRouter.js");
const profileRouter = require("./routes/profileRouter.js");
const requestRouter = require("./routes/requestRouter.js");

// Route Handlers with =>
// 2 parameters -
// app.use("/endpointName", (request, response)=>{});
// 3 parameters -
// app.use("/endpointName", (request, response, next)=>{});
// 4 parameters -
// app.use("/endpointName", (error, request, response, next)=>{});

app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);

connectDB()
  .then(() => {
    console.log("Database connected successfully!");
    app.listen(7777, () => {
      console.log("Server running on port 7777!");
    });
  })
  .catch((err) => {
    console.error("Database cannot be connected!");
  });
