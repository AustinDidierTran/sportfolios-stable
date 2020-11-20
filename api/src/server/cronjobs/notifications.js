const cron = require('node-cron');
const knex = require('../../db/connection');

/*
 ┌────────────── second (optional)
 │ ┌──────────── minute
 │ │ ┌────────── hour
 │ │ │ ┌──────── day of month
 │ │ │ │ ┌────── month
 │ │ │ │ │ ┌──── day of week
 * * * * * *
For full documentation: https://www.npmjs.com/package/node-cron
*/

async function getAllPastHourGamesCaptain() {
  return knex.transaction(async trx => {
    const res = await trx('game_players_view')
      .select()
      .whereRaw(
        "timeslot between now() -INTERVAL '2 hours' and now() - INTERVAL '1 hour'",
      )
      .whereNotNull('player_role')
      .whereNull('notified_end');
    await trx('games')
      .update('notified_end', 'now()')
      .whereIn(
        'id',
        res.map(r => r.game_id),
      );
    return res;
  });
}
//Cron job for score submission reminder
//Run every 15 minutes
/*cron.schedule('0-59/15 * * * *', async () => {
  console.log(
    '%s CRONJOB: executing score submission reminder',
    new Date().toUTCString(),
  );
  const res = await getAllPastHourGamesCaptain();
  res.forEach(
    ({ player_owner, player_id, game_id, event_id, roster_id }) => {
      console.log(player_owner);
    },
  );
  console.log(res);
  console.log(
    '%s CRONJOB: score submission reminder done, %d notifications sent',
    new Date().toUTCString(),
    res.length,
  );
});*/
