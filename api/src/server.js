require('dotenv').config();

const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const cors = require('@koa/cors');
const { CLIENT_BASE_URL } = require('../../conf');

// Middlewares
const checkAuth = require('./server/middleware/check-auth');
const adminOnly = require('./server/middleware/admin-only');
const errorHandler = require('./server/middleware/error-handler');

const publicRoutes = require('./server/routes/public');
const privateRoutes = require('./server/routes/private');
const protectedRoutes = require('./server/routes/protected');
const adminRoutes = require('./server/routes/admin');

const app = new Koa();
const PORT = process.env.PORT || 1337;

const corsOptions = {
  origin: CLIENT_BASE_URL,
};

app.use(errorHandler);
app.use(cors(corsOptions));
app.use(bodyParser());

// public routes
publicRoutes.forEach(route => app.use(route.routes()));

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

module.exports = server;
