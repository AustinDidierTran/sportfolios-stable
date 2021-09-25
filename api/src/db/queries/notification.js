import knex from '../connection.js';
import { NOTIFICATION_TYPE } from '../../../../common/enums/index.js';
import { getRosterName, getRostersNames } from './entity-deprecate.js';

const addNotification = async infos => {
  return knex('notifications').insert(infos);
};

const deleteNotification = async notification_id => {
  return knex('notifications')
    .where({
      id: notification_id,
    })
    .del();
};

const clickNotification = async notification_id => {
  return knex('notifications')
    .where({
      id: notification_id,
    })
    .update({ clicked_at: new Date() });
};

const countUnseenNotifications = async user_id => {
  const res = await knex('notifications')
    .where({ user_id, seen_at: null })
    .count('*')
    .first();
  if (res) {
    return res.count;
  }
};

const seeNotifications = async user_id => {
  return knex('notifications')
    .update({ seen_at: new Date() })
    .where({ user_id, seen_at: null })
    .returning('id');
};

const getNotifications = async (user_id, body) => {
  let res;
  if (body) {
    const { perPage, currentPage } = body;
    const { data } = await knex('notifications_view')
      .where({ user_id })
      .orderBy('created_at', 'desc')
      .offset(currentPage * perPage)
      .limit(perPage);
    res = data;
  } else {
    //Get all
    res = await knex('notifications_view')
      .select('*')
      .where({ user_id })
      .orderBy('created_at', 'desc');
  }
  if (res) {
    const map = Promise.all(
      res.map(async notif => {
        const {
          photo_url: photoUrl,
          clicked_at,
          metadata,
          ...otherProps
        } = notif;
        return {
          photoUrl,
          clicked: Boolean(clicked_at),
          metadata: await formatNotificationMetadata(
            metadata,
            notif.type,
          ),
          ...otherProps,
        };
      }),
    );
    return map;
  }
};

async function formatNotificationMetadata(metadata, type) {
  if (type === NOTIFICATION_TYPE.OTHER_TEAM_SUBMITTED_A_SCORE) {
    const submittedBy = getRosterName(metadata.submittedBy);
    const submitted = isScoreSubmittedByRoster(
      metadata.myRosterId,
      metadata.gameId,
    );
    const score = JSON.parse(metadata.score);
    const rostersId = Object.keys(score);
    const names = await getRostersNames(rostersId);
    const newScore = names.reduce((acc, curr) => {
      const { roster_id, name } = curr;
      acc[name] = score[roster_id];
      return acc;
    }, {});
    return {
      ...metadata,
      score: JSON.stringify(newScore),
      submittedBy: await submittedBy,
      submitted: await submitted,
    };
  }
  return metadata;
}
async function isScoreSubmittedByRoster(myRosterId, game_id) {
  const res = await knex('score_suggestion')
    .select('id')
    .where({ submitted_by_roster: myRosterId, game_id })
    .limit(1);
  if (!res) {
    return;
  }
  return res.length != 0;
}

const getNotificationsSettings = async (user_id, type) => {
  if (type) {
    const [res] = await knex('user_notification_setting')
      .select()
      .where({ user_id, type });
    return res;
  } else {
    //Return an array of every notification type setting
    return knex('user_notification_setting')
      .select()
      .where({ user_id });
  }
};

const upsertNotificationsSettings = async (user_id, body) => {
  return knex('user_notification_setting')
    .insert({ ...body, user_id })
    .onConflict(['user_id', 'type'])
    .merge();
};

const enableAllChatbotNotification = async user_id => {
  return knex('user_notification_setting')
    .update({ chatbot: true })
    .where({ user_id });
};

export {
  getNotifications,
  seeNotifications,
  countUnseenNotifications,
  clickNotification,
  deleteNotification,
  addNotification,
  getNotificationsSettings,
  enableAllChatbotNotification,
  upsertNotificationsSettings,
};
