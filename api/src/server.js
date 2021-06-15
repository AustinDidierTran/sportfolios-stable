require('dotenv').config();

const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const cors = require('@koa/cors');
const { CLIENT_BASE_URL, ANDROID_APP_URL } = require('../../conf');
const socket = require('./server/websocket/socket.io');
//starts the cron jobs
require('./server/cronjobs');

// Middlewares
const getUserInfo = require('./server/middleware/user-info');
const checkAuth = require('./server/middleware/check-auth');
const adminOnly = require('./server/middleware/admin-only');
const errorHandler = require('./server/middleware/error-handler');

const publicRoutes = require('./server/routes/public');
const testRoutes = require('./server/routes/test');
const privateRoutes = require('./server/routes/private');
const protectedRoutes = require('./server/routes/protected');
const adminRoutes = require('./server/routes/admin');

const app = new Koa();
const PORT = process.env.PORT || 1337;

const validOrigins = [CLIENT_BASE_URL, ANDROID_APP_URL];

const corsOptions = {
  origin: verifyOrigin,
};

function verifyOrigin(ctx) {
  const origin = ctx.headers.origin;
  if (!originIsValid(origin)) return false;
  return origin;
}

function originIsValid(origin) {
  console.log({ origin });
  return validOrigins.indexOf(origin) != -1;
}

app.use(errorHandler);
app.use(cors(corsOptions));
app.use(bodyParser());
app.use(getUserInfo);

// public routes
publicRoutes.forEach(route => app.use(route.routes()));

if (process.env.NODE_ENV === 'development') {
  testRoutes.forEach(route => app.use(route.routes()));
}

// private routes
app.use(checkAuth);
privateRoutes.forEach(route => app.use(route.routes()));

// TODO: Protect these routes
protectedRoutes.forEach(route => app.use(route.routes()));

// admin routes
app.use(adminOnly);
adminRoutes.forEach(route => app.use(route.routes()));

const server = app.listen(PORT, () => {
  /* eslint-disable-next-line */
  console.log(`Server listening on port: ${PORT}`);
});

socket.initialize(server);

module.exports = server;
