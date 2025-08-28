const multer = require('multer');

// Configure multer to use memory storage
const storage = multer.memoryStorage();

// Define a file filter to allow only image files
const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = [
        'image/png',
        'image/jpg',
        'image/jpeg',
        'image/webp',
        'image/gif',
        'image/svg+xml',
        'video/mp4'
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true); // Accept the file
    } else {
        cb(new Error('Only image and video files are allowed!'), false); // Reject the file
    }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 9 * 1024 * 1024 // ✅ 15MB file size limit
  }
});


// Export the configured multer instance
module.exports = upload;