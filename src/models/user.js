const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
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
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minLength: 8,
    maxLength: 100,
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
  },
  about: {
    type: String,
    default: "This is default about of the user!",
  },
  skills: {
    type: [String],
  },
});

module.exports = mongoose.model("User", userSchema);
