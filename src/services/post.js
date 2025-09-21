const Post = require("../models/post");

async function createPost(data, userId) {
  return Post.create({ ...data, author: userId });
}

async function getAllPosts(filter = {}) {
  return Post.find(filter).populate("author", "fullName email role");
}

async function getPostById(id) {
  return Post.findById(id).populate("author", "fullName email role");
}

async function updatePost(id, data, userId) {
  const post = await Post.findById(id);
  if (!post) throw Object.assign(new Error("Post not found"), { status: 404 });

  if (post.author.toString() !== userId.toString()) {
    throw Object.assign(new Error("Not authorized to update this post"), { status: 403 });
  }

  Object.assign(post, data);
  return post.save();
}

async function deletePost(id, userId) {
  const post = await Post.findById(id);
  if (!post) throw Object.assign(new Error("Post not found"), { status: 404 });

  if (post.author.toString() !== userId.toString()) {
    throw Object.assign(new Error("Not authorized to delete this post"), { status: 403 });
  }

  return post.deleteOne();
}

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
};
