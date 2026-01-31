import Joi from "joi";

export const signupValidation = (req, res, next) => {
  const schema = Joi.object({
    vendorName: Joi.string().min(3).max(100).required(),
    vendorID: Joi.string().min(14).max(14),
    vendorShopName: Joi.string().min(3).max(100).required(),
    vendorDOB: Joi.date().iso().required(),
    vendorEmail: Joi.string().email().required(),
    vendorPassword: Joi.string().min(3).max(100).required(),
    vendorPhoneNo: Joi.string().min(10).max(13).required(),
    vendorAddress: Joi.string().min(3).max(100).required(),
  });
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ message: "Bad request", error });
  next();
};

export const loginValidation = (req, res, next) => {
  const schema = Joi.object({
    vendorEmail: Joi.string().email().required(),
    vendorPassword: Joi.string().min(3).max(100).required(),
  });
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ message: "Bad request", error });
  next();
};
