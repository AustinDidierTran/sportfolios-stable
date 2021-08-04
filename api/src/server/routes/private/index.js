const data = require('./search');
const entity = require('./entity');
const followers = require('./follower');
const notifications = require('./notification');
const shop = require('./shop');
const stripe = require('./stripe');
const users = require('./user');
const posts = require('./post');
const trialist = require('./trialist');
const interactiveTool = require('./interactiveTool');
const organization = require('./organization');
const facebook = require('./facebook');
const phase = require('./phase');
const phaseRanking = require('./phaseRanking');

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
  interactiveTool,
  organization,
  facebook,
  phase,
  phaseRanking,
];
