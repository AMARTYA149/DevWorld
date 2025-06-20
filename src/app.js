require('dotenv').config()
const express = require("express");
const connectDB = require("./config/database.js");
const app = express();
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/authRouter.js");
const profileRouter = require("./routes/profileRouter.js");
const requestRouter = require("./routes/requestRouter.js");
const userRouter = require("./routes/userRouter.js");
const cors = require("cors");
const PORT = process.env.PORT;
require("./utils/cronjob.js");

// Route Handlers with =>
// 2 parameters -
// app.use("/endpointName", (request, response)=>{});
// 3 parameters -
// app.use("/endpointName", (request, response, next)=>{});
// 4 parameters -
// app.use("/endpointName", (error, request, response, next)=>{});

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());


app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter)

connectDB()
  .then(() => {

    app.listen(PORT, () => {
      console.log("Server running on port! " + process.env.PORT);
      console.log("Database connected successfully!");
    });
  })
  .catch((err) => {
    console.error("Database cannot be connected!");
  });
