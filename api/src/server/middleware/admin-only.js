module.exports = async (ctx, next) => {
  const { userInfo } = ctx.body;

  console.log('userInfo', userInfo);

  if (userInfo.appRole === 1) {
    await next();
  } else {
    ctx.status = 404;
    ctx.body = {
      status: 'error',
      message: 'Access denied'
    }
  }
}