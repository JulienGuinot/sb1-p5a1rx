const Joi = require('joi');

const validateInput = async (schema, data) => {
  try {
    await schema.validateAsync(data);
  } catch (error) {
    throw new UserInputError(error.details[0].message);
  }
};

module.exports = { validateInput };