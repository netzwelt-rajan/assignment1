const multer = require('multer');
const path = require('path');
const { authJwt } = require('../middleware');
const controller = require('../controllers/user.controller');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    // console.log(file);
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    return cb(null, true);
  }

  return cb(new Error('Only image files are allowed!'), false);
};

const upload = multer({ storage, fileFilter });

module.exports = (app) => {
  app.use((req, res, next) => {
    res.header(
      'Access-Control-Allow-Headers',
      'x-access-token, Origin, Content-Type, Accept',
    );
    next();
  });

  app.get('/api/test/all', controller.allAccess);

  app.get('/api/user', [authJwt.verifyToken], controller.userBoard);

  app.put(
    '/api/user/profile',
    [authJwt.verifyToken, upload.single('avtar')],
    controller.userProfile,
  );

  app.post(
    '/api/user/change-password',
    [authJwt.verifyToken],
    controller.changePassword,
  );
};
