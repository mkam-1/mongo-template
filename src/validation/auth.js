const yup = require('yup');

const email = yup.string().email('Invalid email').required('Email required');
const password = yup
.string()
.min(8, 'Password must be at least 8 characters')
.required('Password required');

const registerSchema = yup.object().shape({
fullName: yup.string().trim().min(2).required('Full name required'),
email,
password,
});

const loginSchema = yup.object().shape({
email,
password,
});

module.exports = { registerSchema, loginSchema };