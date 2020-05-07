module.exports = async (ctx, next) => {
  const { userInfo } = ctx.body;


  if (userInfo.appRole === 1) {
    await next();
  } else {
    console.log('Access denied');

    ctx.status = 404;
    ctx.body = {
      status: 'error',
      message: 'Access denied234',
    };
  }
};
