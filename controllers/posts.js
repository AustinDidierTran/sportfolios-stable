const {
  addPost: addPost,
  addPostImageUrl: addPostImageUrl,
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

}

module.exports = { PostsController: PostsController };