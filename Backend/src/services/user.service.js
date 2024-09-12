const _ = require('lodash');
const { AppDataSource } = require('../database/ormconfig');
const User = require('../database/entities/user.entity');
const bcrypt = require('bcrypt');
const { BadRequestError } = require('../errors');

const UserService = module.exports;
const userRepository = AppDataSource.getRepository(User);

UserService.isExistingEmail = async (email) => {
  const user =  await userRepository.findOneBy({ email });
  return _.isNull(user);
};

UserService.insertUser = async (user) => {
  const userData = userRepository.create(user);
  await userRepository.save(userData);
  return userData;
};

UserService.validateUser = async (user) => {
  const userData = await userRepository.findOneBy({ email: user.email });

  if (!_.isNull(userData) && (await bcrypt.compare(user.password, userData.password))) {
    return userData;
  }

  throw new BadRequestError(t('LO-001'));
};

UserService.getUserInfo = async (userID) => {
  return await userRepository.findOneBy({ id: userID });
};
