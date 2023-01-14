const { Router } = require("express");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const { signinValidators } = require("../utils/validators");
const {
  getRefreshToken,
  getAccessToken,
  renewToken,
} = require("../utils/tokenService");

const router = Router();

router.post("/", signinValidators, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: false,
        message: "Validation failed",
        errors,
      });
    }
    const candidate = await User.findOne({
      where: {
        id: req.body.id,
      },
    });

    if (candidate) {
      const areSame = await bcrypt.compare(
        req.body.password,
        candidate.password
      );
      if (areSame) {
        const access_token = getAccessToken(candidate.id);
        const refresh_token = getRefreshToken(candidate.id);
        return res.status(200).cookie("refresh_token", refresh_token).json({
          status: true,
          message: "Successful authorization",
          access_token,
          refresh_token,
        });
      } else {
        return res.status(401).json({
          status: false,
          message: "Invalid email password pair",
        });
      }
    }
  } catch (e) {
    console.log(e);
  }
});

router.post("/new_token", async (req, res) => {
  try {
    const refreshToken = req.cookies.refresh_token;
    if (!refreshToken) {
      return res.status(403).json({
        status: false,
        message: "Access is forbidden, no refresh token",
      });
    } else {
      renewToken(refreshToken).then(({ access_token, refresh_token }) => {
        return res.status(200).cookie("refresh_token", refresh_token).json({
          status: true,
          message: "Successful renew token",
          access_token,
          refresh_token,
        });
      });
    }
  } catch (e) {
    console.log(e);
  }
});
module.exports = router;
