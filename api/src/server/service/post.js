const {
  addPost,
  editPost,
  addPostImageUrl,
  getPostFeed,
  addLike: addLikeHelper,
  deleteLike: deleteLikeHelper,
  addComment: addCommentHelper,
  deleteComment: deleteCommentHelper,
  deletePost: deletePostHelper,
  editComment: editCommentHelper,
} = require('../../db/queries/post');

function create(body, locationId, userId) {
  return addPost(body, locationId, userId);
}

function edit(postId, postContent) {
  return editPost(postId, postContent);
}

function addImage(postId, imageUrl) {
  if (imageUrl && postId) {
    return addPostImageUrl(postId, imageUrl);
  }
}

function getFeedOrganization(userId, organizationId, body) {
  return getPostFeed(userId, [organizationId], body);
}

function getFeed(userId, locationId, body) {
  return getPostFeed(userId, locationId, body);
}

function addLike(entityId, postId) {
  return addLikeHelper(entityId, postId);
}

function deleteLike(entityId, postId) {
  return deleteLikeHelper(entityId, postId);
}

function addComment(entityId, postId, content) {
  return addCommentHelper(entityId, postId, content);
}

function deleteComment(commentId) {
  return deleteCommentHelper(commentId);
}

function deletePost(postId) {
  return deletePostHelper(postId);
}

function editComment(commentId, commentContent) {
  return editCommentHelper(commentId, commentContent);
}

module.exports = {
  create,
  edit,
  addImage,
  getFeedOrganization,
  getFeed,
  addLike,
  deleteLike,
  addComment,
  deleteComment,
  deletePost,
  editComment,
};
