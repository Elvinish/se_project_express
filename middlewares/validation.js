const { Joi, celebrate } = require("celebrate");
const validator = require("validator");

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error("string.uri");
};

const validateCardBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),
    imageUrl: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "imageUrl" field must be filled in',
      "string.uri": 'The "imageUrl" field must be a valid URL',
    }),
    weather: Joi.string().valid("hot", "warm", "cold").required().messages({
      "any.only": "Weather must be one of: hot, warm, cold",
      "string.empty": 'The "weather" field must be filled in',
    }),
  }),
});

// ✅ 2. Validate user registration body
const validateSignupBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).messages({
      "string.min": "Name must be at least 2 characters long",
      "string.max": "Name must be at most 30 characters long",
    }),
    avatar: Joi.string().required().custom(validateURL).messages({
      "string.empty": "Avatar URL is required",
      "string.uri": "Avatar must be a valid URL",
    }),
    email: Joi.string().email().required().messages({
      "string.email": "Email must be valid",
      "string.empty": "Email is required",
    }),
    password: Joi.string().required().messages({
      "string.empty": "Password is required",
    }),
  }),
});

// ✅ 3. Validate login credentials
const validateLoginBody = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required().messages({
      "string.email": "Email must be valid",
      "string.empty": "Email is required",
    }),
    password: Joi.string().required().messages({
      "string.empty": "Password is required",
    }),
  }),
});

const validateItemId = celebrate({
  params: Joi.object().keys({
    itemId: Joi.string().hex().length(24).required().messages({
      "string.hex": "Item ID must be a valid hex string",
      "string.length": "Item ID must be 24 characters long",
      "string.empty": "Item ID is required",
    }),
  }),
});

const validateUserProfileUpdate = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required().messages({
      "string.min": "Name must be at least 2 characters",
      "string.max": "Name must be no more than 30 characters",
      "string.empty": "Name is required",
    }),
    avatar: Joi.string().uri().required().messages({
      "string.uri": "Avatar must be a valid URL",
      "string.empty": "Avatar URL is required",
    }),
  }),
});

// ✅ 4. Validate MongoDB ID
const validateId = celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().length(24).required().messages({
      "string.hex": "ID must be a valid hex string",
      "string.length": "ID must be 24 characters long",
      "string.empty": "ID is required",
    }),
  }),
});

// ✅ Export all validators
module.exports = {
  validateCardBody,
  validateSignupBody,
  validateLoginBody,
  validateId,
  validateItemId,
  validateUserProfileUpdate,
};
