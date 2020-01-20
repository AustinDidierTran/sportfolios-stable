const Koa = require('koa');
const bodyParser = require('koa-bodyparser');

const indexRoutes = require('./server/routes/index');
const associationRoutes = require('./server/routes/associations');

const app = new Koa();
const PORT = process.env.PORT || 1337;

app.use(bodyParser());
app.use(indexRoutes.routes());
app.use(associationRoutes.routes());

const server = app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});

module.exports = server;
