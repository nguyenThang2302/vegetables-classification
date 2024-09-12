const express = require('express');
const { storage } = require('../config/cloudinary.config');
const multer = require('multer');
const upload = multer({ storage });

function addRoutes(router, middleware, controllers) {
  router.post(
    '/uploads/image',
    middleware.authorizer,
    upload.single('image'),
    controllers.mediaController.uploadImages
  );

  router.get(
    '/images',
    middleware.authorizer,
    controllers.mediaController.imagesHistory
  );

  router.get(
    '/images/:image_id',
    middleware.authorizer,
    controllers.mediaController.getImageDetail
  );
}

function apiRouter(middleware, controllers) {
  const router = new express.Router();

  addRoutes(router, middleware, controllers);

  return router;
}

module.exports = (app, middleware, controllers) => {
  app.use('/media', apiRouter(middleware, controllers));
};
