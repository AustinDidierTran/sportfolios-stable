const data = require('./data');
const dev = require('./dev');
const entity = require('./entity');
const followers = require('./followers');
const main = require('./main');
const notifications = require('./notifications');
const profile = require('./profile');
const shop = require('./shop');
const stripe = require('./stripe');
const users = require('./users');
const posts = require('./posts');

module.exports = [
  data,
  dev,
  entity,
  followers,
  main,
  notifications,
  profile,
  posts,
  shop,
  stripe,
  users,
];
