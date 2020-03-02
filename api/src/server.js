const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const cors = require('@koa/cors');

const associationRoutes = require('./server/routes/associations');
const loginRoutes = require('./server/routes/auth');
const indexRoutes = require('./server/routes/index');

const app = new Koa();
const PORT = process.env.PORT || 1337;

app.use(cors());
app.use(bodyParser());
app.use(indexRoutes.routes());
app.use(loginRoutes.routes());
app.use(associationRoutes.routes());

const server = app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});

module.exports = server;
