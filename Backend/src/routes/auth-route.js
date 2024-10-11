const express = require('express');
const validate = require('../validation/validator');
const { AuthValidator } = require('../validation/index');

function addRoutes(router, middleware, controllers) {
  router.post(
    '/register',
    validate([AuthValidator.registerValidator]),
    controllers.authController.register
  );

  router.post(
    '/login',
    validate([AuthValidator.loginValidator]),
    controllers.authController.login
  );

  router.post(
    '/forgot-password',
    validate([AuthValidator.forgotPasswordValidator]),
    controllers.authController.forgotPassword
  )

  router.put(
    '/reset-password',
    validate([AuthValidator.resetPasswordValidator]),
    controllers.authController.resetPassword
  );
}

function apiRouter(middleware, controllers) {
  const router = new express.Router();

  addRoutes(router, middleware, controllers);

  return router;
}

module.exports = (app, middleware, controllers) => {
  app.use('/auth', apiRouter(middleware, controllers));
};
