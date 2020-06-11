const knex = require('../connection');
const { ENTITIES_ROLE_ENUM } = require('../../server/enums');
const moment = require('moment');
const { signS3Request } = require('../../server/utils/aws');

const {
  getAllEntities: getAllEntitiesHelper,
  getEntity: getEntityHelper,
  getAllTypeEntities: getAllTypeEntitiesHelper,
  updateEntityName: updateEntityNameHelper,
  updateEntityPhoto: updateEntityPhotoHelper,
} = require('../helpers/entity');

async function getEntity(id) {
  return getEntityHelper(id);
}

async function getAllEntities(id) {
  return getAllEntitiesHelper(id);
}

async function getAllTypeEntities(id) {
  return getAllTypeEntitiesHelper(id);
}

async function updateEntity(body, user_id) {
  const { id, name, photo_url } = body;

  const [{ role }] = await knex('entities_role')
    .select(['role'])
    .where({ entity_id: id, user_id });

  if (
    [ENTITIES_ROLE_ENUM.ADMIN, ENTITIES_ROLE_ENUM.EDITOR].includes(
      role,
    )
  ) {
    if (name) {
      await updateEntityNameHelper(id, name);
    }
    if (photo_url) {
      console.log('ALLLO');
      await updateEntityPhotoHelper(id, photo_url);
    }
    return { id, name, photo_url };
  }
}

async function getS3Signature(userId, { fileType }) {
  const date = moment().format('YYYYMMDD');
  const randomString = Math.random()
    .toString(36)
    .substring(2, 7);

  const fileName = `images/entity/${date}-${randomString}-${userId}`;
  const data = await signS3Request(fileName, fileType);

  return { code: 200, data };
}
module.exports = {
  getAllEntities,
  getAllTypeEntities,
  getEntity,
  getS3Signature,
  updateEntity,
};
