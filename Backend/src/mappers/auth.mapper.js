const AuthMapper = module.exports;

const { JWT_ACCESS_TOKEN_EXPIRES_IN} = process.env;

AuthMapper.toInfoRegister = (data) => ({
  id: data.id,
  email: data.email
});

AuthMapper.toInfoLogin = (access_token) => ({ data: {
  access_token: access_token,
  token_type: "Bearer",
  expires_in: JWT_ACCESS_TOKEN_EXPIRES_IN
}});
