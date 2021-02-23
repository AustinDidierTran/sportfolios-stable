const {
  PostServices
} = require('../api/src/db/services/posts');

class PostsController {

  static async create(body, userId) {
    const post = await PostServices.addPost(body, userId);

    return post;
  }

  static async addImage(postId, imageUrl) {
    if (imageUrl && postId) {
      const res = await PostServices.addPostImageUrl(postId, imageUrl);
      return res;
    }

  }

  static async getFeedOrganization(userId, organizationId, body) {
    const res = await PostServices.getPostFeed(userId, [organizationId], body);
    return res;
  }

  static async addLike(entityId, postId) {
    const res = await PostServices.addLike(entityId, postId);
    return res;
  }

  static async deleteLike(entityId, postId) {
    const res = await PostServices.deleteLike(entityId, postId);

    return res;
  }

  static async addComment(entityId, postId, content) {
    const res = await PostServices.addComment(entityId, postId, content);
    return res;
  }

  static async deleteComment(commentId) {
    const res = await PostServices.deleteComment(commentId);
    return res;
  }

  static async deletePost(postId) {
    await PostServices.deletePost(postId);
  }
}

module.exports = { PostsController };