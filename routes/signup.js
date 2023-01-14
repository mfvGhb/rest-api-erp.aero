const { Router } = require("express");
const bcrypt = require("bcrypt");

const { validationResult } = require("express-validator");
const { signupValidators } = require("../utils/validators");
const User = require("../models/User");
const { getAccessToken, getRefreshToken } = require("../utils/tokenService");

const router = Router();

router.post("/", signupValidators, async (req, res) => {
  try {
    const { id, password } = req.body;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: false,
        message: "Validation failed",
        errors,
      });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const result = await User.create({ id: id, password: hashPassword });
    const access_token = getAccessToken(result);
    const refresh_token = getRefreshToken(result);
    return res.status(201).cookie("refresh_token", refresh_token).json({
      status: true,
      message: "User successful created",
      access_token,
      refresh_token,
    });
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
