import dotenv from 'dotenv';
dotenv.config();

import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';
import { validOrigins } from '../../conf.js';
import * as socket from './server/websocket/socket.io.js';
//starts the cron jobs
import './server/cronjobs/index.js';

// Middlewares
import getUserInfo from './server/middleware/user-info.js';

import checkAuth from './server/middleware/check-auth.js';
import adminOnly from './server/middleware/admin-only.js';
import errorHandler from './server/middleware/error-handler.js';
import publicRoutes from './server/routes/public/index.js';
import testRoutes from './server/routes/test/index.js';
import privateRoutes from './server/routes/private/index.js';
import adminRoutes from './server/routes/admin/index.js';

const app = new Koa();
const PORT = process.env.PORT || 1337;

const corsOptions = {
  origin: verifyOrigin,
};

function verifyOrigin(ctx) {
  const origin = ctx.headers.origin;
  if (!originIsValid(origin)) return false;
  return origin;
}

function originIsValid(origin) {
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

// admin routes
app.use(adminOnly);
adminRoutes.forEach(route => app.use(route.routes()));

const server = app.listen(PORT, () => {
  /* eslint-disable-next-line */
  console.log(`Server listening on port: ${PORT}`);
});

socket.initialize(server);

export default server;
