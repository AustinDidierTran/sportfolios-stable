const data = require('./search');
const entity = require('./entity');
const followers = require('./follower');
const notifications = require('./notification');
const shop = require('./shop');
const stripe = require('./stripe');
const users = require('./user');
const posts = require('./post');
const trialist = require('./trialist');

module.exports = [
  data,
  entity,
  followers,
  notifications,
  posts,
  shop,
  stripe,
  users,
  trialist,
];
