import Joi from "joi";

export const userRegisterSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  subscription: Joi.string().valid("starter", "pro", "business").required(),
});

export const userLoginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
