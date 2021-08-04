const entity = require('./entity');
const facebook = require('./facebook');
const follower = require('./follower');
const interactiveTool = require('./interactiveTool');
const notification = require('./notification');
const organization = require('./organization');
const phase = require('./phase');
const phaseRanking = require('./phaseRanking');
const post = require('./post');
const search = require('./search');
const shop = require('./shop');
const stripe = require('./stripe');
const trialist = require('./trialist');
const user = require('./user');

module.exports = [
  entity,
  facebook,
  follower,
  interactiveTool,
  notification,
  organization,
  phase,
  phaseRanking,
  post,
  search,
  shop,
  stripe,
  trialist,
  user,
];
