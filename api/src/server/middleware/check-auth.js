module.exports = async (ctx, next) => {
  if (!ctx.body || !ctx.body.userInfo || !ctx.body.userInfo.id) {
    throw 'Access denied';
  }

  return next();
};
