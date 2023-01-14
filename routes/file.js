const { Router } = require("express");
const path = require("path");
const fs = require("fs");
const tokenVerify = require("../middleware/tokenVerify");
const fileUploader = require("../utils/fileUploader");
const File = require("../models/File");

const router = Router();

router.post(
  "/upload",
  tokenVerify,
  fileUploader.single("file"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          status: false,
          message: "No file",
        });
      }
      File.create({
        name: req.file.filename,
        type: req.file.mimetype,
        extension: path.extname(req.file.originalname),
        size: req.file.size,
        uploadAt: new Date().toISOString().slice(0, 19).replace("T", " "),
        userId: req.userId,
      })
        .then((response) => {
          return res.status(200).json({
            status: true,
            message: "A file successful uploaded",
            response,
          });
        })
        .catch((err) => {
          return res.status(400).json({
            status: false,
            message: "A file not uploaded",
            err,
          });
        });
    } catch (e) {
      console.log(e);
    }
  }
);

router.get("/list", tokenVerify, async (req, res) => {
  try {
    const { list_size, page } = req.body;
    File.findAndCountAll({
      limit: list_size ? list_size : 10,
      offset: page ? (page - 1) * list_size : 0,
    }).then((response) => {
      return res.status(200).json({
        status: true,
        message: "A list file",
        list_size,
        page,
        ...response,
      });
    });
  } catch (e) {
    console.log(e);
  }
});

router.delete("/delete/:id", tokenVerify, async (req, res) => {
  try {
    const file_id = req.params.id;
    const file = await File.findOne({
      where: { id: file_id },
    });
    if (!file) {
      return res.status(401).json({ status: false, message: "File not found" });
    }
    const file_exist = fs.existsSync(`./public/uploads/${file.name}`);
    if (!file_exist) {
      return res.status(401).json({ status: false, message: "File not found" });
    }
    fs.unlinkSync(`./public/uploads/${file.name}`);
    file
      .destroy()
      .then(() => {
        return res.status(200).json({ status: true, message: "File deleted" });
      })
      .catch((err) => {
        return res.status(401).json({ status: false, message: err });
      });
  } catch (e) {
    console.log(e);
  }
});

router.get("/:id", tokenVerify, async (req, res) => {
  try {
    const file = await File.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!file) {
      return res.status(401).json({ status: false, message: "File not found" });
    } else {
      return res.status(200).json({
        status: true,
        message: "A file info",
        file,
      });
    }
  } catch (e) {
    console.log(e);
  }
});

router.get("/download/:id", tokenVerify, async (req, res) => {
  try {
    const file = await File.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!file) {
      return res.status(401).json({ status: false, message: "File not found" });
    } else {
      return res
        .status(200)
        .download(
          `./public/uploads/${file.name}`,
          `${file.name.split("_")[1]}`
        );
    }
  } catch (e) {
    console.log(e);
  }
});

router.put(
  "/update/:id",
  tokenVerify,
  fileUploader.single("file"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          status: false,
          message: "No file",
        });
      }
      const file = await File.findOne({
        where: {
          id: req.params.id,
        },
      });
      if (!file) {
        return res
          .status(401)
          .json({ status: false, message: "File not found" });
      } else {
        const file_exist = fs.existsSync(`./public/uploads/${file.name}`);
        if (!file_exist) {
          return res
            .status(401)
            .json({ status: false, message: "File not found" });
        }
        fs.unlinkSync(`./public/uploads/${file.name}`);
        file.name = req.file.filename;
        file.type = req.file.mimetype;
        file.extension = path.extname(req.file.originalname);
        file.size = req.file.size;
        file.uploadAt = new Date().toISOString().slice(0, 19).replace("T", " ");
        file.save().then((response) => {
          return res.status(200).json({
            status: true,
            message: "A file successful uploaded",
            response,
          });
        });
      }
    } catch (e) {
      console.log(e);
    }
  }
);

module.exports = router;
