const { AuthService } = require('../services/index');
const Controller = module.exports;

Controller.register = async (req, res, next) => {
  try {
    const user = req.body;
    return await AuthService.registerService(user, req, res, next);
  } catch (error) {
    next(error);
  }
};

Controller.login = async (req, res, next) => {
  try {
    const user = req.body;
    return await AuthService.loginService(user, req, res, next);
  } catch (error) {
    next(error);
  }
};
