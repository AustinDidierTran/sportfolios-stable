module.exports = async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    console.log('err', err);
    console.log('process.env.NODE_ENV', process.env.NODE_ENV);

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
