require('dotenv').config();

const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const cors = require('@koa/cors');
const { CLIENT_BASE_URL } = require('../../conf');

// Middlewares
const checkAuth = require('./server/middleware/check-auth');
const adminOnly = require('./server/middleware/admin-only');

// Unprotected routes
const associationRoutes = require('./server/routes/associations');
const dataRoutes = require('./server/routes/data');
const authRoutes = require('./server/routes/auth');
const profileRoutes = require('./server/routes/profile');
const userRoutes = require('./server/routes/users');

// Admin routes
const adminRoutes = require('./server/routes/admin');

const app = new Koa();
const PORT = process.env.PORT || 1337;

const corsOptions = {
  origin: CLIENT_BASE_URL,
};

app.use(cors(corsOptions));
app.use(bodyParser());
app.use(authRoutes.routes());
app.use(checkAuth);
app.use(associationRoutes.routes());
app.use(dataRoutes.routes());
app.use(profileRoutes.routes());
app.use(userRoutes.routes());
app.use(adminOnly);
app.use(adminRoutes.routes());

const server = app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});

module.exports = server;
