const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const cors = require('@koa/cors');

// Middlewares
const checkAuth = require('./server/middleware/check-auth');
const adminOnly = require('./server/middleware/admin-only');

// Unprotected routes
const associationRoutes = require('./server/routes/associations');
const indexRoutes = require('./server/routes/index');
const authRoutes = require('./server/routes/auth');
const userRoutes = require('./server/routes/users');

// Admin routes
const adminRoutes = require('./server/routes/admin');

const app = new Koa();
const PORT = process.env.PORT || 1337;

app.use(cors());
app.use(bodyParser());
app.use(checkAuth);
app.use(indexRoutes.routes());
app.use(associationRoutes.routes());
app.use(authRoutes.routes());
app.use(userRoutes.routes());
app.use(adminOnly);
app.use(adminRoutes.routes());

const server = app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});

module.exports = server;
