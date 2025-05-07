const jwt = require("jsonwebtoken");
const User = require("../models/user");
const JWT_SECRET_WORD = "Dev@World_149";

const userAuth = async (req, res, next) => {
  // Read the token from the req
  // Check id from the token in the database and get user
  // call the next route handler using next()
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("Invalid token!!!");
    }

    const decodedObj = await jwt.verify(token, JWT_SECRET_WORD);
    const { _id } = decodedObj;

    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User not found!");
    } else {
      req.user = user;
      next();
    }
  } catch (error) {
    res.status(400).send("Error: " + error);
  }
};

module.exports = {
  userAuth,
};
