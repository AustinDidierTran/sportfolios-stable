const cron = require('node-cron');
const knex = require('../../db/connection');
const {
  sendNotification,
} = require('../../db/queries/notifications');

const { getPersonInfos } = require('../../db/queries/entity');

const {
  NOTIFICATION_TYPE,
  ROSTER_ROLE_ENUM,
} = require('../../../../common/enums');

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
      .whereNot('player_role', ROSTER_ROLE_ENUM.PLAYER)
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
cron.schedule('0-59/15 * * * *', async () => {
  // eslint-disable-next-line no-console
  console.log(
    '%s CRONJOB: executing score submission reminder',
    new Date().toUTCString(),
  );
  const res = await getAllPastHourGamesCaptain();
  res.forEach(
    async ({
      player_owner,
      player_id,
      game_id,
      event_id,
      event_name,
    }) => {
      const metadata = {
        gameId: game_id,
        eventId: event_id,
        eventName: event_name,
        playerId: player_id,
      };
      const emailInfos = {
        name: (await getPersonInfos(player_id)).name,
        eventName: event_name,
        eventId: event_id,
        type: NOTIFICATION_TYPE.SCORE_SUBMISSION_REQUEST,
        gameId: game_id,
      };
      sendNotification(
        {
          user_id: player_owner,
          metadata,
          type: NOTIFICATION_TYPE.SCORE_SUBMISSION_REQUEST,
          entity_photo: event_id,
        },
        emailInfos,
      );
    },
  );
  // eslint-disable-next-line no-console
  console.log(
    '%s CRONJOB: score submission reminder done, %d notifications sent',
    new Date().toUTCString(),
    res.length,
  );
});
