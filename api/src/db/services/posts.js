const knex = require('../connection');
const {
  ENTITIES_ROLE_ENUM,
} = require('../../../../common/enums');

async function addPost(body, entity_id) {
  const { content } = body;

  const [idPost] = await knex('posts')
    .insert({ entity_id, content })
    .returning('id');
  return idPost;

}

async function addPostImageUrl(post_id, image_url) {
  await knex('post_image')
    .insert({ post_id, image_url });
}
module.exports = {
  addPost,
  addPostImageUrl,
}
