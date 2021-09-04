const FACEBOOK_BASE_URL = 'https://graph.facebook.com/v8.0';
import crypto from 'crypto';
import axios from 'axios';
import knex from '../connection.js';
import { BASIC_CHATBOT_STATES } from '../../../../common/enums/index.js';
import util from 'util';

const getMessengerIdFromFbID = async facebook_id => {
  const hmac = crypto.createHmac(
    'sha256',
    process.env.FACEBOOK_APP_SECRET,
  );
  hmac.update(process.env.FACEBOOK_APP_TOKEN);
  const appsecret_proof = hmac.digest('hex');
  const uri = `${FACEBOOK_BASE_URL}/${facebook_id}/ids_for_pages?page=${process.env.FACEBOOK_PAGE_ID}&access_token=${process.env.FACEBOOK_APP_TOKEN}&appsecret_proof=${appsecret_proof}`;
  const res = await axios.get(uri).catch(function (error) {
    // eslint-disable-next-line no-console
    console.log(error.response.data);
    return;
  });
  if (res && res.data && res.data.data.length > 0) {
    return res.data.data[0].id;
  } else {
    return;
  }
};

const sendMessage = async (messengerId, message) => {
  const uri = `${FACEBOOK_BASE_URL}/me/messages?access_token=${process.env.FACEBOOK_PAGE_TOKEN}`;
  const body = {
    messaging_type: 'UPDATE',
    recipient: {
      id: messengerId,
    },
    message,
  };
  const res = await axios.post(uri, body).catch(function (error) {
    // eslint-disable-next-line no-console
    console.log(error.response.data);
    return;
  });
  return res;
};

const getNameFromPSID = async messengerId => {
  const uri = `${FACEBOOK_BASE_URL}/${messengerId}?fields=first_name&access_token=${process.env.FACEBOOK_PAGE_TOKEN}`;
  const res = await axios.get(uri).catch(function (error) {
    // eslint-disable-next-line no-console
    console.log(error.response.data);
    return;
  });
  if (res && res.data && res.data.first_name) {
    return res.data.first_name;
  } else {
    return;
  }
};

const logMessage = async infos => {
  return knex('logs_chatbot').insert(infos);
};

//Return Timezone, number relative to GMT
const getTimezoneFromPSID = async messengerId => {
  const uri = `${FACEBOOK_BASE_URL}/${messengerId}?fields=timezone&access_token=${process.env.FACEBOOK_PAGE_TOKEN}`;
  const res = await axios.get(uri).catch(function (error) {
    // eslint-disable-next-line no-console
    console.log(error.response.data);
    return;
  });
  if (res && res.data && res.data.timezone) {
    return res.data.timezone;
  } else {
    return;
  }
};

const setMessengerId = async (userId, messengerId) => {
  return knex('user_apps_id')
    .where({ user_id: userId })
    .update({ messenger_id: messengerId })
    .returning('messenger_id');
};

const getChatbotInfos = async messengerId => {
  const infos = await knex('messenger_user_chatbot_state')
    .select('*')
    .first()
    .where({ messenger_id: messengerId });

  if (infos) {
    const {
      messenger_id: messengerId,
      chatbot_infos: chatbotInfos,
      ...otherInfos
    } = infos;
    return {
      messengerId,
      chatbotInfos,
      ...otherInfos,
    };
  }
};

const setChatbotInfos = async (messengerId, infos) => {
  const res = await knex('messenger_user_chatbot_state')
    .update({ ...infos })
    .where({ messenger_id: messengerId })
    .returning('*');
  if (res) {
    return {
      messengerId: res.messenger_id,
      state: res.state,
      chatbotInfos: res.chatbot_infos,
    };
  }
};

const addChatbotId = async messengerId => {
  const name = await getNameFromPSID(messengerId);
  const [res] = await knex('messenger_user_chatbot_state')
    .insert({
      messenger_id: messengerId,
      chatbot_infos: { userName: name },
      state: BASIC_CHATBOT_STATES.NOT_LINKED,
    })
    .returning('*');
  return {
    messengerId: res.messenger_id,
    state: res.state,
    chatbotInfos: res.chatbot_infos,
  };
};

const deleteChatbotInfos = async messengerId => {
  await knex('user_apps_id')
    .update({ messenger_id: null })
    .where({ messenger_id: messengerId });
  return knex('messenger_user_chatbot_state')
    .del()
    .where({ messenger_id: messengerId })
    .returning('messenger_id');
};

const setFacebookData = async (userId, data) => {
  const { facebook_id, name, surname, email, picture } = data;
  let updateQuery = {};
  if (!facebook_id) {
    return;
  }
  if (name) {
    updateQuery.name = name;
  }
  if (surname) {
    updateQuery.surname = surname;
  }
  if (email) {
    updateQuery.email = email;
  }
  if (picture) {
    updateQuery.picture = picture;
  }
  if (Object.keys(updateQuery).length === 0) {
    return;
  }
  return knex.transaction(async trx => {
    //Upsert data
    const insertData = trx('facebook_data').insert({
      facebook_id,
      name,
      surname,
      email,
      picture,
    });
    const updateData = trx('facebook_data')
      .update(updateQuery)
      .whereRaw('facebook_data.facebook_id = ?', [facebook_id]);
    const queryData = util.format(
      '%s ON CONFLICT (facebook_id) DO UPDATE SET %s RETURNING *',
      insertData.toString(),
      updateData.toString().replace(/^update\s.*\sset\s/i, ''),
    );
    const datas = await knex.raw(queryData);

    //Update user__facebook_id
    const success = await trx('user_apps_id')
      .update({ facebook_id })
      .where({ user_id: userId });
    if (success) {
      return datas;
    }
  });
};

const getMessengerId = async userId => {
  const [res] = await knex('user_apps_id')
    .where({ user_id: userId })
    .select('messenger_id');
  if (res) {
    return res.messenger_id;
  }
};

const deleteMessengerId = async userId => {
  //Reseting chatbot state
  await setChatbotInfos(await getMessengerId(userId), {
    state: BASIC_CHATBOT_STATES.NOT_LINKED,
  });
  const res = await knex('user_apps_id')
    .update({ messenger_id: null })
    .where({ user_id: userId })
    .returning('user_id');

  return res;
};

const getFacebookId = async userId => {
  const [id] = await knex('user_apps_id')
    .select('facebook_id')
    .where({ user_id: userId });
  return id && id.facebook_id;
};

const deleteFacebookId = async userId => {
  return knex('user_apps_id')
    .update({ facebook_id: null })
    .where({ user_id: userId })
    .returning('user_id');
};

const isLinkedFacebookAccount = async facebookId => {
  return (
    await knex.first(
      knex.raw(
        'exists ?',
        knex('user_apps_id')
          .select('user_id')
          .where({ facebook_id: facebookId }),
      ),
    )
  ).exists;
};

export {
  addChatbotId,
  deleteChatbotInfos,
  deleteFacebookId,
  deleteMessengerId,
  getChatbotInfos,
  getFacebookId,
  getMessengerIdFromFbID,
  getMessengerId,
  getNameFromPSID,
  getTimezoneFromPSID,
  isLinkedFacebookAccount,
  logMessage,
  sendMessage,
  setFacebookData,
  setMessengerId,
  setChatbotInfos
};
