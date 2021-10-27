import express from "express"
import multer from "multer"
import { CloudinaryStorage } from "multer-storage-cloudinary"
import { v2 as cloudinary } from "cloudinary"

const cloudinaryStorage = new CloudinaryStorage({
  cloudinary, // CREDENTIALS, this line of code is going to search in your process.env for something called CLOUDINARY_URL
  params: {
    folder: "strive-books",
  },
})

import { saveStudentsPictures } from "../../lib/fs-tools.js"

const filesRouter = express.Router()

filesRouter.post("/:studentID/uploadSingle", multer().single("profilePic"), async (req, res, next) => {
  try {
    console.log(req.file)

    await saveStudentsPictures(req.file.originalname, req.file.buffer)
    res.send("ok")
  } catch (error) {
    next(error)
  }
})

filesRouter.post("/uploadMultiple", multer().array("profilePic"), async (req, res, next) => {
  try {
    console.log(req.files)

    const arrayOfPromises = req.files.map(file => saveStudentsPictures(file.originalname, file.buffer))
    await Promise.all(arrayOfPromises)
    res.send("OK")
  } catch (error) {
    next(error)
  }
})

filesRouter.post("/uploadCloudinary", multer({ storage: cloudinaryStorage }).single("profilePic"), async (req, res, next) => {
  try {
    console.log(req.file)
    res.send("Image uploaded on Cloudinary")
  } catch (error) {
    next(error)
  }
})

export default filesRouter
