module.exports = (schema, property = 'body') => async (req, res, next) => {
  try {
    const validated = await schema.validate(req[property], { stripUnknown: true });
    req[property] = validated;
    next();
  } catch (err) {
    err.status = 400;
    next(err);
  }
};
