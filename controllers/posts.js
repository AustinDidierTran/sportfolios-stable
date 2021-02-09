const {
  addPost,
  addPostImageUrl,
  getPostFeed,
  addLike,
  deleteLike,
  addComment,
  deleteComment,
} = require('../api/src/db/services/posts');

class PostsController {

  static async create(body, userId) {
    const postId = await addPost(body, userId);

    return postId;
  }

  static async addImage(postId, imageUrl) {

    if (imageUrl && postId) {
      await addPostImageUrl(postId, imageUrl);

      return true;
    }

  }

  static async getFeedOrganization(userId, organizationId, body) {
    const res = await getPostFeed(userId, [organizationId], body);
    return res;
  }

  static async addLike(entityId, postId) {
    const res = await addLike(entityId, postId);
    return res;
  }

  static async deleteLike(entityId, postId) {
    await deleteLike(entityId, postId);
  }

  static async addComment(entityId, postId, content) {
    const res = await addComment(entityId, postId, content);
    return res;
  }

  static async deleteComment(commentId) {
    const res = await deleteComment(commentId);
    return res;
  }
}

module.exports = { PostsController: PostsController };