import Joi from "joi";

export const userRegisterSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const userLoginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const userVerifySchema = Joi.object({
  email: Joi.string().email().required(),
});
