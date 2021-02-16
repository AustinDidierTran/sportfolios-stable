const knex = require('../connection');
const {
  ENTITIES_ROLE_ENUM,
} = require('../../../../common/enums');

class PostServices {
  static async addLike(entity_id, post_id) {

    await knex('post_like')
      .insert({ entity_id, post_id })
      .returning('created_at');


    const post = await PostServices.getPost(post_id, entity_id);

    return post;
  }

  static async deleteLike(entity_id, post_id) {

    await knex('post_like')
      .where({
        entity_id: entity_id,
        post_id: post_id,
      })
      .del();

    const post = await PostServices.getPost(post_id, entity_id);

    return post;
  }
  static async addPost(body, entity_id) {
    const { content } = body;

    const [post_id] = await knex('posts')
      .insert({ entity_id, content })
      .returning('id');
    return post_id;

  }

  static async addPostImageUrl(post_id, image_url) {
    await knex('post_image')
      .insert({ post_id, image_url });
  }

  static async getPost(post_id, user_id) {
    let [data] = await knex
      .select(
        'posts.id',
        'posts.entity_id',
        'posts.content',
        'posts.created_at',
        'posts.updated_at',
        'entities_name.name',
        'entities_name.surname',
        'entities_photo.photo_url',
        knex.raw(`(SELECT COUNT(*) > 0 AS liked FROM post_like WHERE entity_id = '${user_id}' AND post_id = '${post_id}')`),
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
      .where(
        'posts.id',
        post_id
      );
    if (data) {
      const images = await knex
        .select('image_url')
        .from('post_image')
        .where('post_image.post_id', data.id);
      data.images = images;

      const likes = await knex
        .select('*')
        .from('post_like')
        .leftJoin(
          'entities_name',
          'post_like.entity_id',
          '=',
          'entities_name.entity_id'
        )
        .where('post_like.post_id', data.id);

      data.likes = likes;

      const comments = await knex
        .select(
          'post_comment.id',
          'post_comment.post_id',
          'post_comment.entity_id',
          'post_comment.content',
          'post_comment.parent_id',
          'post_comment.created_at',
          'entities_name.name',
          'entities_name.surname',
          'entities_photo.photo_url',
        )
        .from('post_comment')
        .leftJoin(
          'entities_name',
          'post_comment.entity_id',
          '=',
          'entities_name.entity_id'
        )
        .leftJoin(
          'entities_photo',
          'post_comment.entity_id',
          '=',
          'entities_photo.entity_id',
        )
        .where('post_comment.post_id', data.id)
        .orderBy('post_comment.created_at', 'desc');
      data.comments = comments;


      return data;

    }
    return [];
  }


  static async getPostFeed(user_id, array_entity_id, body) {
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
          knex.raw(`(SELECT COUNT(*) > 0 AS liked FROM post_like WHERE entity_id = '${user_id}' AND post_id = posts.id)`),
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
              .select(
                'post_comment.id',
                'post_comment.post_id',
                'post_comment.entity_id',
                'post_comment.content',
                'post_comment.parent_id',
                'post_comment.created_at',
                'entities_name.name',
                'entities_name.surname',
                'entities_photo.photo_url',
              )
              .from('post_comment')
              .leftJoin(
                'entities_name',
                'post_comment.entity_id',
                '=',
                'entities_name.entity_id'
              )
              .leftJoin(
                'entities_photo',
                'post_comment.entity_id',
                '=',
                'entities_photo.entity_id',
              )
              .where('post_comment.post_id', objectSql.id)
              .orderBy('post_comment.created_at', 'desc');
            objectSql.comments = comments;
            return objectSql;
          })
        );
        return arrayPosts;
      }
      return [];
    }

  }

  static async addComment(entity_id, post_id, content) {
    const [comment_id] = await knex('post_comment')
      .insert({ post_id, entity_id, content })
      .returning('id');


    const post = await PostServices.getPost(post_id, entity_id);
    return post;


  }

  static async deleteComment(comment_id) {
    const [post_id, entity_id] = await knex('post_comment')
      .where({ id: comment_id })
      .returning([post_id, entity_id])
      .del();

    return [post_id, entity_id];
  }

}
module.exports = {
  PostServices
}
