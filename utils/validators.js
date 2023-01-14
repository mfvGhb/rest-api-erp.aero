const { body } = require("express-validator");
const User = require("../models/user");

exports.signupValidators = [
  body("id")
    .isEmail()
    .withMessage("Please enter a valid email")
    .custom(async (value) => {
      try {
        const user = await User.findOne({ where: { id: value } });
        if (user) {
          return Promise.reject("This email is already taken");
        }
      } catch (e) {
        console.log(e);
      }
    })
    .normalizeEmail(),
  body("password", "Password must be at least 6 characters")
    .isLength({ min: 6, max: 56 })
    .isAlphanumeric()
    .trim(),
];

exports.signinValidators = [
  body("id")
    .isEmail()
    .withMessage("Please enter a valid email")
    .custom(async (value) => {
      try {
        const user = await User.findOne({
          attributes: ["id"],
          where: { id: value },
        });
        if (!user) {
          return Promise.reject("User with this email does not exist");
        }
      } catch (e) {
        console.log(e);
      }
    })
    .normalizeEmail(),
  body("password", "Password must be at least 6 characters")
    .isLength({ min: 6, max: 56 })
    .isAlphanumeric()
    .trim(),
];
