const { isExistingEmail, insertUser, validateUser, getUserByEmail, updatePassword } = require('./user.service');
const { sendCodeForgotPassword } = require('./mail.service');
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

AuthService.forgotPasswordService = async (email, req, res, next) => {
  try {
    if (await isExistingEmail(email)) {
      throw new BadRequestError(t('FO-001'));
    }

    const codeForgotPassword = Math.floor(100000 + Math.random() * 900000).toString();
    const payload = {
      email: email,
      code: codeForgotPassword
    };
    const tokenForgot = await jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: parseInt(JWT_ACCESS_TOKEN_EXPIRES_IN) });
    await sendCodeForgotPassword(email, codeForgotPassword);
    return ok(req, res, AuthMapper.toResponseForgotPassword(tokenForgot));
  } catch (error) {
    next(error);
  }
};

AuthService.resetPasswordService = async (req, res, next) => {
  try {
    const { email, token, code, password } = req.body;
    const payload = await jwt.verify(token, JWT_SECRET_KEY);

    if (!payload) {
      throw new BadRequestError(t('FO-002'));
    }

    if (payload.email !== email || payload.code !== code) {
      throw new BadRequestError(t('FO-003'));
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await getUserByEmail(email);
    await updatePassword(user.id, hashedPassword);
    return ok(req, res, AuthMapper.toInfoRegister(user));
  } catch (error) {
    next(error);
  }
};
