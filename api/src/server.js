require('dotenv').config();

const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const cors = require('@koa/cors');
const { CLIENT_BASE_URL } = require('../../conf');

// Middlewares
const checkAuth = require('./server/middleware/check-auth');
const adminOnly = require('./server/middleware/admin-only');

// Unprotected routes
const dataRoutes = require('./server/routes/data');
const devRoutes = require('./server/routes/dev');
const authRoutes = require('./server/routes/auth');
const followerRoutes = require('./server/routes/followers');
const notificationRoutes = require('./server/routes/notifications');
const profileRoutes = require('./server/routes/profile');
const userRoutes = require('./server/routes/users');
const mainRoutes = require('./server/routes/main');
const stripeRoutes = require('./server/routes/stripe');
const entityRoutes = require('./server/routes/entity');
const shopRoutes = require('./server/routes/shop');

// Admin routes
const adminRoutes = require('./server/routes/admin');

const app = new Koa();
const PORT = process.env.PORT || 1337;

const corsOptions = {
  origin: CLIENT_BASE_URL,
};

app.use(cors(corsOptions));
app.use(bodyParser());

// public routes
app.use(authRoutes.routes());

// private routes
app.use(checkAuth);
app.use(dataRoutes.routes());
if (process.env.NODE_ENV === 'development') {
  app.use(devRoutes.routes());
}
app.use(followerRoutes.routes());
app.use(mainRoutes.routes());
app.use(notificationRoutes.routes());
app.use(profileRoutes.routes());
app.use(entityRoutes.routes());
app.use(stripeRoutes.routes());
app.use(userRoutes.routes());
app.use(shopRoutes.routes());

// admin routes
app.use(adminOnly);
app.use(adminRoutes.routes());

const server = app.listen(PORT, () => {
  /* eslint-disable-next-line */
  console.log(`Server listening on port: ${PORT}`);
});

module.exports = server;
