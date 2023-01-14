const { verifyToken } = require("../utils/tokenService");

function tokenVerify(req, res, next) {
  const token = req.get("authorization");
  const refresh_token = req.cookies.refresh_token;
  if (!token) {
    return res.status(401).json({
      status: false,
      message: "No token",
    });
  }
  verifyToken(token, refresh_token)
    .then((result) => {
      req.userId = result.user;
      next();
    })
    .catch((err) => {
      console.log(err);
      res.status(401).json({
        status: false,
        message: err,
      });
    });
}

module.exports = tokenVerify;
