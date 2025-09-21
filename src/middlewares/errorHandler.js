module.exports = (err, req, res, next) => {
// normalize
const status = err.status || 500;
const message = err.message || 'Internal Server Error';


if (process.env.NODE_ENV === 'development') {
console.error(err);
return res.status(status).json({ ok: false, status, message, stack: err.stack });
}


res.status(status).json({ ok: false, status, message });
};