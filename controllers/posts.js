const {
  addPost,
  editPost,
  addPostImageUrl,
  getPostFeed,
  addLike,
  deleteLike,
  addComment,
  deleteComment,
  deletePost,
  editComment,
} = require('../api/src/db/helpers/posts');

class PostsController {
  static async create(body, locationId, userId) {
    const post = await addPost(body, locationId, userId);

    return post;
  }

  static async edit(postId, postContent) {
    await editPost(postId, postContent);
  }

  static async addImage(postId, imageUrl) {
    if (imageUrl && postId) {
      const res = await addPostImageUrl(postId, imageUrl);
      return res;
    }
  }

  static async getFeedOrganization(userId, organizationId, body) {
    const res = await getPostFeed(userId, [organizationId], body);
    return res;
  }

  static async getFeed(userId, locationId, body) {
    const res = await getPostFeed(userId, locationId, body);
    return res;
  }

  static async addLike(entityId, postId) {
    const res = await addLike(entityId, postId);
    return res;
  }

  static async deleteLike(entityId, postId) {
    const res = await deleteLike(entityId, postId);

    return res;
  }

  static async addComment(entityId, postId, content) {
    const res = await addComment(entityId, postId, content);
    return res;
  }

  static async deleteComment(commentId) {
    await deleteComment(commentId);
  }

  static async deletePost(postId) {
    await deletePost(postId);
  }

  static async editComment(commentId, commentContent) {
    await editComment(commentId, commentContent);
  }
}

module.exports = { PostsController };
