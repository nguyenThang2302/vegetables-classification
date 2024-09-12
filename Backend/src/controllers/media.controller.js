const { MediaService } = require('../services/index');

const Controller = module.exports;

Controller.uploadImages = async (req, res, next) => {
  try {
    await MediaService.insertImage(req, res, next);
  } catch (error) {
    return next(error);
  }
};

Controller.imagesHistory = async (req, res, next) => {
  try {
    await MediaService.getImagesHistory(req, res, next);
  } catch (error) {
    return next (error);
  }
}

Controller.getImageDetail = async (req, res, next) => {
  try {
    await MediaService.getImageDetail(req, res, next);
  } catch (error) {
    return next(error);
  }
}
