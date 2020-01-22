const Router = require('koa-router');
const queries = require('../../db/queries/associations');

const router = new Router();
const BASE_URL = '/api/v1/login';

router.post(BASE_URL, async ctx => {
  ctx.status = 200;
  ctx.body = {
    status: 'success',
    data: {
      username: 'AustinDidierTran',
    },
  };
  // try {
  //   const association = await queries.addAssociation(
  //     ctx.request.body,
  //   );
  //   if (association.length) {
  //     ctx.status = 201;
  //     ctx.body = {
  //       status: 'success',
  //       data: association,
  //     };
  //   } else {
  //     ctx.status = 400;
  //     ctx.body = {
  //       status: 'error',
  //       message: 'Something went wrong',
  //     };
  //   }
  // } catch (err) {
  //   ctx.status = 400;
  //   ctx.body = {
  //     status: 'error',
  //     message: err.message || 'Sorry, an error has occured',
  //   };
  // }
});

module.exports = router;
