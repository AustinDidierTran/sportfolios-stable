const auth = require('./auth');
const entity = require('./entity');
const facebook = require('./facebook');
const googleAnalytics = require('./googleAnalytics');
const notification = require('./notification');
const post = require('./post');
const shop = require('./shop');
const user = require('./user');

module.exports = [
  auth,
  entity,
  facebook,
  googleAnalytics,
  notification,
  post,
  shop,
  user,
];
