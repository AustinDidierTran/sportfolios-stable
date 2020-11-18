const cron = require('node-cron');
console.log('coucou');

cron.schedule('30 * * * * *', () => {
  console.log("Hello I'm a cron job");
});
