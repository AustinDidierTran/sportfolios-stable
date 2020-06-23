module.exports = async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = 400;
    ctx.body = {
      status: 'error',
      message:
        process.env.NODE_ENV === 'development'
          ? err.message || 'Sorry, an error has occured'
          : 'Sorry, an error has occured',
    };
  }
};
