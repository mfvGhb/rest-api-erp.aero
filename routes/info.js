const { Router } = require("express");

const tokenVerify = require("../middleware/tokenVerify");

const User = require("../models/User");
const router = Router();

router.get("/", tokenVerify, async (req, res) => {
  try {
    const result = await User.findOne({
      attributes: ["id"],
      where: { id: req.userId },
    });
    res.status(200).json({
      status: true,
      message: "Info route",
      id: result.id,
    });
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
