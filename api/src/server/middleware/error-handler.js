module.exports = async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    if (err === 'token expired') {
      ctx.status = 413;
      ctx.body = {
        status: 'error',
        message:
          process.env.NODE_ENV === 'development'
            ? err.message || 'Sorry, an error has occured'
            : 'Sorry, an error has occured',
      };
    } else {
      ctx.status = 400;
      ctx.body = {
        status: 'error',
        message:
          process.env.NODE_ENV === 'development'
            ? err.message || 'Sorry, an error has occured'
            : 'Sorry, an error has occured',
      };
    }
  }
};
