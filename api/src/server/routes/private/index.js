const data = require('./search');
const dev = require('./dev');
const entity = require('./entity');
const followers = require('./followers');
const notifications = require('./notifications');
const shop = require('./shop');
const stripe = require('./stripe');
const users = require('./users');
const posts = require('./posts');
const trialist = require('./trialist');

module.exports = [
  data,
  dev,
  entity,
  followers,
  notifications,
  posts,
  shop,
  stripe,
  users,
  trialist,
];
