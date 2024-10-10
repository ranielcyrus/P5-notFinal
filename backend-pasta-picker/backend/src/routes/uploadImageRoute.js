import express from 'express';
import cloudinary from '../utils/cloudinary.js'; // Default import
import { upload } from '../middlewares/multer.js'; // Corrected path

const router = express.Router();

//this route uploads the selected image to cloudinary and make a link. that link can be used in the DB
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path);
    res.status(200).json({
      success: true,
      message: "Uploaded!",
      data: result,
    });
    
    //this is the link after uploading it in cloudinary
    console.log(result.url)//pls use this link as payload going to our DB

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Error uploading image",
    });
  }
});

export default router;