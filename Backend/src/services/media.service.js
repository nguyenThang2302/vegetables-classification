const { AppDataSource } = require('../database/ormconfig');
const { MediaMapper } = require('../mappers/index');
const Image = require('../database/entities/image.entity');
const UserImage = require('../database/entities/user_image.entity');
const {ok} = require('../helpers/response.helper');
const config = require('../config/config');
const MediaService = module.exports;

const imageRepository = AppDataSource.getRepository(Image);
const userImageRepository = AppDataSource.getRepository(UserImage);

MediaService.insertImage = async (req, res, next) => {
  try {
    const urlImage = req.file.path;
    const userID = req.user['id'];

    const requestBody = {
      image_url: urlImage
    };

    const response = await fetch(`${config.base_url_model}/predict`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });
    const data = await response.json();

    const imageData = imageRepository.create({
      name: data.prediction.predicted_class,
      url: urlImage
    });
    await imageRepository.save(imageData);

    const userImageData = userImageRepository.create({
      user_id: userID,
      image_id: imageData.id
    });
    await userImageRepository.save(userImageData);

    return ok(req, res, MediaMapper.toImageUrlResponse(imageData.name, urlImage));
  } catch (error) {
    return next(error);
  }
};

MediaService.getImagesHistory = async (req, res, next) => {
  try {
    const { limit = 10, offset = 1 } = req.query;
    const userID = req.user['id'];
    const images = await imageRepository.createQueryBuilder('images')
                      .innerJoin('images.user_images', 'user_images', 'user_images.user_id = :user_id', { user_id: userID})
                      .select()
                      .orderBy('images.created_at', 'DESC')
                      .limit(limit)
                      .offset(limit * (offset - 1))
                      .getMany();
    return ok(req, res, MediaMapper.toImagesHistoryResponse(images));
  } catch (error) {
    return next(error);
  }
};

MediaService.getImageDetail = async (req, res, next) => {
  try {
    const userID = req.user['id'];
    const imageID = parseInt(req.params.image_id);

    const imageDetail = await imageRepository.createQueryBuilder('images')
                          .innerJoin('images.user_images', 'user_images', 'user_images.user_id = :user_id', { user_id: userID})
                          .select([
                            'images.id as id',
                            'images.name as name',
                            'images.url as url',
                            'images.created_at as created_at'
                          ])
                          .where('images.id = :id', { id: imageID })
                          .getRawOne();

    return ok(req, res, MediaMapper.toImageDetailResponse(imageDetail));
  } catch (error) {
    return next(error);
  }
};
