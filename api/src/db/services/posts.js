const knex = require('../connection');

class PostServices {
  static async addLike(entity_id, post_id) {
    await knex('post_like')
      .insert({ entity_id, post_id })
      .returning('created_at');

    const post = await PostServices.getPost(post_id, entity_id);

    return post;
  }

  static async editComment(commentId, commentContent) {
    await knex('post_comment')
      .update('content', commentContent)
      .where({
        id: commentId,
      });
  }

  static async editPost(post_id, post_content) {
    await knex('post_image')
      .where({
        post_id,
      })
      .del();

    await knex('posts')
      .update({
        content: post_content,
      })
      .where({
        id: post_id,
      });
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
  static async addPost(body, location_id, entity_id) {
    const { content } = body;

    const [post_id] = await knex('posts')
      .insert({ entity_id, content, location_id })
      .returning('id');

    const post = await PostServices.getPost(post_id, entity_id);

    return post;
  }

  static async deletePost(post_id) {
    await knex('post_like')
      .where({
        post_id,
      })
      .del();

    await knex('post_image')
      .where({
        post_id,
      })
      .del();

    await knex('post_comment')
      .where({
        post_id,
      })
      .del();

    await knex('posts')
      .where({
        id: post_id,
      })
      .del();
  }

  static async addPostImageUrl(post_id, image_url) {
    await knex('post_image').insert({ post_id, image_url });
    const images = await knex
      .select('image_url')
      .from('post_image')
      .where('post_image.post_id', post_id);
    return images;
  }

  static async getPost(post_id, user_id) {
    let [data] = await knex
      .select(
        'posts.id',
        'posts.entity_id',
        'posts.content',
        'posts.created_at',
        'posts.updated_at',
        'entities_general_infos.name',
        'entities_general_infos.surname',
        'entities_general_infos.photo_url',
        knex.raw(
          `(SELECT COUNT(*) > 0 AS liked FROM post_like WHERE entity_id = '${user_id}' AND post_id = '${post_id}')`,
        ),
      )
      .from('posts')
      .leftJoin(
        'entities_general_infos',
        'posts.entity_id',
        '=',
        'entities_general_infos.entity_id',
      )
      .where('posts.id', post_id);
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
          'entities_general_infos',
          'post_like.entity_id',
          '=',
          'entities_general_infos.entity_id',
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
          'entities_general_infos.name',
          'entities_general_infos.surname',
          'entities_general_infos.photo_url',
        )
        .from('post_comment')
        .leftJoin(
          'entities_general_infos',
          'post_comment.entity_id',
          '=',
          'entities_general_infos.entity_id',
        )
        .where('post_comment.post_id', data.id)
        .orderBy('post_comment.created_at', 'desc');
      data.comments = comments;

      return data;
    }
    return [];
  }

  static async getPostFeed(user_id, locationId, body) {
    if (user_id == -1) {
      user_id = '00000000-00a0-0000-a00a-000000000000';
    }

    if (body) {
      const { perPage, currentPage } = body;
      const { data } = await knex
        .select(
          'posts.id',
          'posts.entity_id',
          'posts.content',
          'posts.created_at',
          'posts.updated_at',
          'entities_general_infos.name',
          'entities_general_infos.surname',
          'entities_general_infos.photo_url',
          knex.raw(
            `(SELECT COUNT(*) > 0 AS liked FROM post_like WHERE entity_id = '${user_id}' AND post_id = posts.id)`,
          ),
        )
        .from('posts')
        .leftJoin(
          'entities_general_infos',
          'posts.entity_id',
          '=',
          'entities_general_infos.entity_id',
        )
        .where('posts.location_id', locationId)
        .orderBy('posts.created_at', 'desc')
        .paginate({ perPage, currentPage });
      if (data) {
        const arrayPosts = await Promise.all(
          data.map(async objectSql => {
            const data = await knex
              .select('image_url')
              .from('post_image')
              .where('post_image.post_id', objectSql.id);
            objectSql.images = data;

            const likes = await knex
              .select('*')
              .from('post_like')
              .leftJoin(
                'entities_general_infos',
                'post_like.entity_id',
                '=',
                'entities_general_infos.entity_id',
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
                'entities_general_infos.name',
                'entities_general_infos.surname',
                'entities_general_infos.photo_url',
              )
              .from('post_comment')
              .leftJoin(
                'entities_general_infos',
                'post_comment.entity_id',
                '=',
                'entities_general_infos.entity_id',
              )
              .where('post_comment.post_id', objectSql.id)
              .orderBy('post_comment.created_at', 'desc');
            objectSql.comments = comments;
            return objectSql;
          }),
        );
        return arrayPosts;
      }
      return [];
    }
  }

  static async addComment(entity_id, post_id, content) {
    await knex('post_comment')
      .insert({ post_id, entity_id, content })
      .returning('id');

    const post = await PostServices.getPost(post_id, entity_id);
    return post;
  }

  static async deleteComment(comment_id) {
    await knex('post_comment')
      .where({ id: comment_id })
      .del();
  }
}
module.exports = {
  PostServices,
};
