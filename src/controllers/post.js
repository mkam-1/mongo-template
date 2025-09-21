const asyncWrapper = require("../utils/asyncWrapper");
const postService = require("../services/post");

exports.create = asyncWrapper(async (req, res) => {
  console.log(req.user)
  const post = await postService.createPost(req.body, req.user.id);
  res.status(201).json({ ok: true, data: post });
});

exports.getAll = asyncWrapper(async (req, res) => {
  const posts = await postService.getAllPosts();
  res.json({ ok: true, data: posts });
});

exports.getById = asyncWrapper(async (req, res) => {
  const post = await postService.getPostById(req.params.id);
  if (!post) return res.status(404).json({ ok: false, message: "Post not found" });
  res.json({ ok: true, data: post });
});

exports.update = asyncWrapper(async (req, res) => {
  const updated = await postService.updatePost(req.params.id, req.body, req.user.id);
  res.json({ ok: true, data: updated });
});

exports.deletePost = asyncWrapper(async (req, res) => {
  await postService.deletePost(req.params.id, req.user.id);
  res.json({ ok: true, message: "Post deleted" });
});
