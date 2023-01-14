const express = require("express");
const cors = require("cors");
const logger = require("morgan");
const cookieParser = require("cookie-parser");

const path = require("path");

const database = require("./utils/database");

const indexRoute = require("./routes/index");
const infoRoute = require("./routes/info");
const signinRoute = require("./routes/signin");
const signupRoute = require("./routes/signup");
const logoutRoute = require("./routes/logout");
const fileRoute = require("./routes/file");

const server = express();
const PORT = process.env.PORT || 3000;

server.use(logger("dev"));
server.use(cors());
server.use(cookieParser());
server.use(express.json());
server.use(express.static(path.join(__dirname, "public")));
server.use(express.urlencoded({ extended: false }));

server.use("/", indexRoute);
server.use("/info", infoRoute);
server.use("/signin", signinRoute);
server.use("/signup", signupRoute);
server.use("/logout", logoutRoute);
server.use("/file", fileRoute);

server.use((req, res) => {
  res.status(404).json({ status: false, message: "Invalid request" });
});

function start() {
  try {
    database
      .sync()
      .then(console.log("Database has been connected successful."))
      .catch((e) => console.error("Unable to connect to the database:", e));
    server.listen(PORT, () => {
      console.log(`App started on port: ${PORT}.`);
    });
  } catch (e) {
    console.log(e);
  }
}

start();
