const express = require("express");
const multer = require("multer");
const fs = require("fs");
const {
  uploadMediaToCloudinary,
  deleteMediaFromCloudinary,
} = require("../../helpers/cloudinary");

const router = express.Router();

// Temporary storage for incoming uploads
const upload = multer({ dest: "uploads/" });

// Single file upload
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file provided" });
    }

    //Upload to Cloudinary
    const result = await uploadMediaToCloudinary(req.file.path);

    //Delete temp file after uploading
    fs.unlinkSync(req.file.path);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (e) {
    console.error("Error uploading file:", e);
    res.status(500).json({ success: false, message: "Error uploading file" });
  }
});

//Delete media using public_id
router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Asset ID is required",
      });
    }

    await deleteMediaFromCloudinary(id);

    res.status(200).json({
      success: true,
      message: "Asset deleted successfully from Cloudinary",
    });
  } catch (e) {
    console.error("Error deleting file:", e);
    res.status(500).json({ success: false, message: "Error deleting file" });
  }
});

// Bulk upload (up to 10 files)
router.post("/bulk-upload", upload.array("files", 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: "No files provided" });
    }

    const uploadPromises = req.files.map((fileItem) =>
      uploadMediaToCloudinary(fileItem.path)
    );

    const results = await Promise.all(uploadPromises);

    // Delete all temporary files
    req.files.forEach((fileItem) => fs.unlinkSync(fileItem.path));

    res.status(200).json({
      success: true,
      data: results,
    });
  } catch (e) {
    console.error("Error in bulk uploading:", e);
    res
      .status(500)
      .json({ success: false, message: "Error in bulk uploading files" });
  }
});

module.exports = router;
