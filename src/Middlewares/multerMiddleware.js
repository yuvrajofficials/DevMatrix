import multer from 'multer';

const videoStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads'); // Temporary directory for uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const uploadV = multer({ 
  storage:videoStorage,
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('video/') || file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type, only video and image files are allowed!'), false);
    }
  }
}).fields([
  { name: 'videoFile', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 }
])

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/temp'); // Specify the destination directory
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Use the original file name
  }
});

const uploadR = multer({ storage: storage });


// Multer storage configuration for blog resources
const resourceStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/temp'); // Store in temp directory before Cloudinary upload
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Prevent file name conflicts
  }
});

const uploadBlogResource = multer({
  storage: resourceStorage,
}); // Handle single resource upload

// Export
export { uploadV,uploadR,uploadBlogResource };


