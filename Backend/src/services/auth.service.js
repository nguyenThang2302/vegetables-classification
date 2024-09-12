const { isExistingEmail, insertUser, validateUser } = require('./user.service');
const {ok} = require('../helpers/response.helper');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { BadRequestError } = require('../errors');
const { AuthMapper } = require('../mappers/index');

const { JWT_SECRET_KEY, JWT_ACCESS_TOKEN_EXPIRES_IN} = process.env;

const AuthService = module.exports;

AuthService.registerService = async (user, req, res, next) => {
  try {
    if (!await isExistingEmail(user.email)) {
      throw new BadRequestError(t('RE-001'));
    }

    const hashedPassword = await bcrypt.hash(user.password, 10);
    const userData = {
      name: user.name,
      email: user.email,
      password: hashedPassword
    };
    const userInsert = await insertUser(userData);

    return ok(req, res, AuthMapper.toInfoRegister(userInsert));
  } catch (error) {
    next(error);
  }
};

AuthService.loginService = async (user, req, res, next) => {
  try {
    const userData = await validateUser(user);

    const payload = {
      id: userData.id,
      email: userData.email
    };

    const accessToken = await jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: parseInt(JWT_ACCESS_TOKEN_EXPIRES_IN) });
    return ok(req, res, AuthMapper.toInfoLogin(accessToken));
  } catch (error) {
    next(error);
  }
};
