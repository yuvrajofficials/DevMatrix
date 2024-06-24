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
    cb(null, "./public/temp"); // Specify the destination directory
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Use the original file name
  }
});

const uploadP = multer({ storage });
export { uploadV,uploadP };


