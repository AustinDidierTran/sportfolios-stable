const knex = require('../connection');
const {
  ENTITIES_ROLE_ENUM,
} = require('../../../../common/enums');

async function addLike(entity_id, post_id) {

  const [created_at] = await knex('post_like')
    .insert({ entity_id, post_id })
    .returning('created_at');
  return created_at;
}

async function deleteLike(entity_id, post_id) {

  await knex('post_like')
    .where({
      entity_id: entity_id,
      post_id: post_id,
    })
    .del();
}
async function addPost(body, entity_id) {
  const { content } = body;

  const [post_id] = await knex('posts')
    .insert({ entity_id, content })
    .returning('id');
  return post_id;

}

async function addPostImageUrl(post_id, image_url) {
  await knex('post_image')
    .insert({ post_id, image_url });
}

async function getPostFeed(user_id, array_entity_id, body) {
  let res;
  if (body) {
    const { perPage, currentPage } = body;
    const { data } = await knex
      .select(
        'posts.id',
        'posts.entity_id',
        'posts.content',
        'posts.created_at',
        'posts.updated_at',
        'entities_name.name',
        'entities_name.surname',
        'entities_photo.photo_url',
        knex.raw(`(SELECT COUNT(*) AS liked FROM post_like WHERE entity_id = '${user_id}' AND post_id = posts.id)`),
      )
      .from('posts')
      .leftJoin(
        'entities_name',
        'posts.entity_id',
        '=',
        'entities_name.entity_id',
      )
      .leftJoin(
        'entities_photo',
        'posts.entity_id',
        '=',
        'entities_photo.entity_id',
      )
      .whereIn(
        'posts.entity_id',
        array_entity_id
      )
      .orderBy('posts.created_at', 'desc')
      .paginate({ perPage, currentPage });
    if (data) {
      const arrayPosts = await Promise.all(
        data.map(async (objectSql) => {
          const data = await knex
            .select('image_url')
            .from('post_image')
            .where('post_image.post_id', objectSql.id);
          objectSql.images = data;

          const likes = await knex
            .select('*')
            .from('post_like')
            .leftJoin(
              'entities_name',
              'post_like.entity_id',
              '=',
              'entities_name.entity_id'
            )
            .where('post_like.post_id', objectSql.id);

          objectSql.likes = likes;

          const comments = await knex
            .select('*')
            .from('post_comment')
            .leftJoin(
              'entities_name',
              'post_comment.entity_id',
              '=',
              'entities_name.entity_id'
            )
            .where('post_comment.post_id', objectSql.id);
          objectSql.comments = comments;
          return objectSql;
        })
      );
      return arrayPosts;
    }
    return [];
  }

}

async function addComment(entity_id, post_id, content) {
  const [comment_id] = await knex('post_comment')
    .insert({ post_id, entity_id, content })
    .returning('id');
  return comment_id;
}

async function deleteComment(comment_id) {
  await knex('post_comment')
    .where({ id: comment_id })
    .del();
}
module.exports = {
  addPost,
  addPostImageUrl,
  getPostFeed,
  addLike,
  deleteLike,
  addComment,
  deleteComment,
}
