const yup = require("yup");

const createPostSchema = yup.object().shape({
  title: yup.string().trim().min(3).required("Title is required"),
  content: yup.string().min(10).required("Content is required"),
  tags: yup.array().of(yup.string().trim()).optional(),
});

const updatePostSchema = yup.object().shape({
  title: yup.string().trim().min(3),
  content: yup.string().min(10),
  tags: yup.array().of(yup.string().trim()),
  isPublished: yup.boolean(),
});

module.exports = { createPostSchema, updatePostSchema };
