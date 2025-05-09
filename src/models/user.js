const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const JWT_SECRET_WORD = "Dev@World_149";

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minLength: 3,
      maxLength: 50,
    },
    lastName: {
      type: String,
      trim: true,
      minLength: 3,
      maxLength: 50,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email address: " + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Enter a Strong Password!");
        }
      },
    },
    age: {
      type: Number,
      trim: true,
      min: 18,
    },
    gender: {
      type: String,
      trim: true,
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Please provide a valid gender!");
        }
      },
    },
    photoUrl: {
      type: String,
      default: "https://static.thenounproject.com/png/4154905-200.png",
      trim: true,
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid Photo URL: " + value);
        }
      },
    },
    about: {
      type: String,
      default: "This is default about of the user!",
    },
    skills: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.getJWT = async function () {
  const user = this;

  const token = await jwt.sign({ _id: user._id }, JWT_SECRET_WORD, {
    expiresIn: "1d",
  });

  return token;
};

module.exports = mongoose.model("User", userSchema);
