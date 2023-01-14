const jwt = require("jsonwebtoken");
const config = require("config");

const JWT_SECRET = config.get("JWT_SECRET");
const JWT_REFRESH_SECRET = config.get("JWT_REFRESH_SECRET");

const getAccessToken = (payload) => {
  return jwt.sign({ user: payload }, JWT_SECRET, { expiresIn: "10min" });
};

const getRefreshToken = (payload) => {
  return jwt.sign({ user: payload }, JWT_REFRESH_SECRET, { expiresIn: "7d" });
};

const verifyToken = (token, refresh_token) => {
  return new Promise((resolve, reject) => {
    if (!token.startsWith("Bearer") || !refresh_token) {
      return reject("Token is invalid");
    }
    token = token.slice(7, token.length);
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return reject(err.message);
      } else {
        if (!decoded || !decoded.user) {
          return reject("Token is invalid");
        }
        resolve(decoded);
      }
    });
  });
};

const renewToken = (refreshToken) => {
  return new Promise(async (resolve, reject) => {
    const { user } = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    if (user) {
      resolve({
        id: user,
        access_token: getAccessToken(user),
        refresh_token: getRefreshToken(user),
      });
    } else {
      reject("Bad refresh token, no user");
    }
  });
};

module.exports = {
  getAccessToken,
  getRefreshToken,
  verifyToken,
  renewToken,
};
