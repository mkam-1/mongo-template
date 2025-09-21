module.exports = (schema) => async (req, res, next) => {
try {
const validated = await schema.validate(req.body, { stripUnknown: true });
req.body = validated;
next();
} catch (err) {
err.status = 400;
next(err);
}
};