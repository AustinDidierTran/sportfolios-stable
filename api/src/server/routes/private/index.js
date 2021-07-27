const data = require('./data');
const dev = require('./dev');
const entity = require('./entity');
const followers = require('./followers');
const main = require('./main');
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
  main,
  notifications,
  posts,
  shop,
  stripe,
  users,
  trialist,
];
