const { Router } = require("express");
const { renewToken } = require("../utils/tokenService");
const tokenVerify = require("../middleware/tokenVerify");
const router = Router();

router.get("/", tokenVerify, async (req, res) => {
  try {
    const refresh_token = req.cookies.refresh_token;
    renewToken(refresh_token).then(({ access_token, refresh_token }) => {
      return res.status(200).cookie("refresh_token", refresh_token).json({
        status: true,
        message: "Successful logout, renew token",
        access_token,
        refresh_token,
      });
    });
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
