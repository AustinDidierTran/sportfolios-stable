module.exports = async (ctx, next) => {
  if (
    ctx.body &&
    ctx.body.userInfo &&
    ctx.body.userInfo.error === 'token expired'
  ) {
    throw 'token expired';
  }
  if (!ctx.body || !ctx.body.userInfo || !ctx.body.userInfo.id) {
    throw 'Access denied';
  }

  return next();
};
