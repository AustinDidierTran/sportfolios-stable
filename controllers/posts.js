const {
  addPost: addPost,
  addPostImageUrl: addPostImageUrl,
  getPostFeed: getPostFeed,
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

  static async getFeedOrganization(organizationId, body) {
    const res = await getPostFeed([organizationId], body);
    return res;
  }

}

module.exports = { PostsController: PostsController };