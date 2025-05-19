const validator = require("validator");
const bcrypt = require("bcrypt");

const validateSignupData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("Name is not valid!");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Please enter valid email address!");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter a strong password!");
  }
};

const validateEditProfileData = (req) => {
  const allowedEditFields = [
    "firstName",
    "lastName",
    "age",
    "gender",
    "photoUrl",
    "about",
    "emailId",
    "skills",
  ];

  const isEditAllowed = Object.keys(req.body).every((field) =>
    allowedEditFields.includes(field)
  );

  return isEditAllowed;
};

const validateCurrentPassword = async (req) => {
  const user = req.user;
  const currentPasswordEntered = req.body.currentPassword;
  const isPasswordValid = await bcrypt.compare(
    currentPasswordEntered, user.password
  );

  return isPasswordValid;
}

module.exports = {
  validateSignupData,
  validateEditProfileData, validateCurrentPassword
};
