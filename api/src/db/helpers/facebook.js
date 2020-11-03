const FACEBOOK_BASE_URL = 'https://graph.facebook.com/v8.0';
const crypto = require('crypto');
const axios = require('axios');
const knex = require('../connection');

const getMessengerIdFromFbID = async facebook_id => {
  const hmac = crypto.createHmac(
    'sha256',
    process.env.FACEBOOK_APP_SECRET,
  );
  hmac.update(process.env.FACEBOOK_APP_TOKEN);
  const appsecret_proof = hmac.digest('hex');
  const uri = `${FACEBOOK_BASE_URL}/${facebook_id}/ids_for_pages?page=${process.env.FACEBOOK_PAGE_ID}&access_token=${process.env.FACEBOOK_APP_TOKEN}&appsecret_proof=${appsecret_proof}`;
  const res = await axios.get(uri).catch(function(error) {
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
  const res = await axios.post(uri, body).catch(function(error) {
    // eslint-disable-next-line no-console
    console.log(error.response.data);
    return;
  });
  return res;
};

const getNameFromPSID = async messengerId => {
  const uri = `${FACEBOOK_BASE_URL}/${messengerId}?fields=first_name&access_token=${process.env.FACEBOOK_PAGE_TOKEN}`;
  const res = await axios.get(uri).catch(function(error) {
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
  return knex(logs_chatbot).insert(infos);
};

module.exports = {
  getMessengerIdFromFbID,
  sendMessage,
  getNameFromPSID,
  logMessage,
};
