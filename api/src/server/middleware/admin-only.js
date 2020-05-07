module.exports = async (ctx, next) => {
  const { userInfo } = ctx.body;

<<<<<<< HEAD
  if (userInfo.appRole === 1) {
    await next();
  } else {
=======

  if (userInfo.appRole === 1) {
    await next();
  } else {

>>>>>>> 861dff54963c97f148cdd1ffd688a3bd44b9b7ac
    ctx.status = 404;
    ctx.body = {
      status: 'error',
      message: 'Access denied',
    };
  }
};
