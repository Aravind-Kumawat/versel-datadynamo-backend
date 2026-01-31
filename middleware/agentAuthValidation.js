import Joi from "joi";

export const signupValidation = (req, res, next) => {
  const schema = Joi.object({
    agentName: Joi.string().min(3).max(100).required(),
    agencyName: Joi.string().min(3).max(100).required(),
    agentDOB: Joi.date().iso().required(),
    agentEmail: Joi.string().email().required(),
    agentPassword: Joi.string().min(3).max(100).required(),
    agentPhoneNo: Joi.string().min(10).max(13).required(),
    agentAddress: Joi.string().min(3).max(100).required(),
  });
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ message: "Bad request", error });
  next();
};

export const loginValidation = (req, res, next) => {
  const schema = Joi.object({
    agentEmail: Joi.string().email().required(),
    agentPassword: Joi.string().min(3).max(100).required(),
  });
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ message: "Bad request", error });
  next();
};
