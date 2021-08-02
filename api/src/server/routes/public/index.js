const auth = require('./auth');
const entity = require('./entity');
const shop = require('./shop');
const googleAnalytics = require('./googleAnalytics');
const user = require('./user');
const facebook = require('./facebook');
const posts = require('./post');
const notifications = require('./notification');

module.exports = [
  auth,
  entity,
  shop,
  googleAnalytics,
  user,
  posts,
  facebook,
  notifications,
];
