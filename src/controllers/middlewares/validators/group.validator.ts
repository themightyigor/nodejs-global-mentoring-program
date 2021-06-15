import Joi from "@hapi/joi";

export const groupValidator = Joi.object({
  id: Joi
    .string()
    .required(),
  name: Joi
    .string()
    .alphanum()
    .min(3)
    .max(15)
    .required(),
  permissions: Joi
    .array()
    .items(
      Joi.string().valid('READ', 'WRITE', 'DELETE', 'SHARE', 'UPLOAD_FILES')
    )
    .required(),
});
