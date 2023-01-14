const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "public/uploads"),
  filename: (req, file, cb) =>
    cb(null, Date.now().toString() + "_" + file.originalname),
});
const fileUploader = multer({ storage });
module.exports = fileUploader;
