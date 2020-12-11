import React, { useLayoutEffect, useState } from 'react';
import { Card } from '@material-ui/core';
import { List } from '../../../components/Custom';
import { useTranslation } from 'react-i18next';
import styles from './Notifications.module.css';
import api from '../../../actions/api';
import {
  LIST_ITEM_ENUM,
  NOTIFICATION_MEDIA,
  NOTIFICATION_TYPE,
} from '../../../../../common/enums';
const iconMap = {
  [NOTIFICATION_TYPE.ADDED_TO_ROSTER]: 'PeopleIcon',
  [NOTIFICATION_TYPE.SCORE_SUBMISSION_CONFLICT]: 'Notifications',
  [NOTIFICATION_TYPE.SCORE_SUBMISSION_REQUEST]: 'RateReview',
  [NOTIFICATION_TYPE.OTHER_TEAM_SUBMITTED_A_SCORE]: 'RateReview',
};

const titleMap = {
  [NOTIFICATION_TYPE.ADDED_TO_ROSTER]: 'added_to_roster',
  [NOTIFICATION_TYPE.SCORE_SUBMISSION_CONFLICT]:
    'score_submission_conflict',
  [NOTIFICATION_TYPE.SCORE_SUBMISSION_REQUEST]:
    'score_submission_request',
  [NOTIFICATION_TYPE.OTHER_TEAM_SUBMITTED_A_SCORE]:
    'other_team_submitted_a_score',
};

const descriptionMap = {
  [NOTIFICATION_TYPE.ADDED_TO_ROSTER]: 'added_to_roster_description',
  [NOTIFICATION_TYPE.SCORE_SUBMISSION_CONFLICT]:
    'score_submission_conflict_description',
  [NOTIFICATION_TYPE.SCORE_SUBMISSION_REQUEST]:
    'score_submission_request_description',
  [NOTIFICATION_TYPE.OTHER_TEAM_SUBMITTED_A_SCORE]:
    'other_team_submitted_a_score_description',
};
export default function Notifications() {
  const { t } = useTranslation();
  const [switchesState, setSwitchesState] = useState({});
  const [chatbotDisabled, setChatbotDisabled] = useState(true);

  const getStateKey = (type, media) => {
    return type + ' ' + media;
  };

  const getDefaultState = chatbotDisabled => {
    return Object.values(NOTIFICATION_TYPE).reduce(
      (prev, current) => {
        prev[getStateKey(current, NOTIFICATION_MEDIA.EMAIL)] = true;
        prev[
          getStateKey(current, NOTIFICATION_MEDIA.CHATBOT)
        ] = !chatbotDisabled;
        return prev;
      },
      {},
    );
  };

  const handleChange = ({ type, media, enabled }) => {
    setSwitchesState(prev => {
      return {
        ...prev,
        [getStateKey(type, media)]: enabled,
      };
    });
    const body = { type };
    if (media === NOTIFICATION_MEDIA.EMAIL) {
      body.email = enabled;
    }
    if (media === NOTIFICATION_MEDIA.CHATBOT) {
      body.chatbot = enabled;
    }
    api('/api/notifications/settings', {
      method: 'PUT',
      body: JSON.stringify({
        ...body,
      }),
    });
  };

  const fetchSettings = async () => {
    const { data } = await api('/api/notifications/settings/all');
    if (!data) {
      return;
    }
    const { chatbotDisabled, notifications } = data;
    const tempState = getDefaultState(chatbotDisabled);
    notifications.forEach(s => {
      tempState[getStateKey(s.type, NOTIFICATION_MEDIA.EMAIL)] =
        s.email;
      tempState[getStateKey(s.type, NOTIFICATION_MEDIA.CHATBOT)] =
        !chatbotDisabled && s.chatbot;
    });
    setSwitchesState(tempState);
    setChatbotDisabled(chatbotDisabled);
  };
  useLayoutEffect(() => {
    fetchSettings();
  }, []);

  return (
    <Card className={styles.card}>
      <List
        title={t('notifications')}
        items={Object.values(NOTIFICATION_TYPE).map(notifType => {
          return {
            type: LIST_ITEM_ENUM.NOTIFICATION_SETTING,
            email:
              switchesState[
                getStateKey(notifType, NOTIFICATION_MEDIA.EMAIL)
              ],
            chatbot:
              switchesState[
                getStateKey(notifType, NOTIFICATION_MEDIA.CHATBOT)
              ],
            chatbotDisabled: chatbotDisabled,
            name: t(titleMap[notifType]) || notifType,
            description: t(descriptionMap[notifType]),
            onChange: handleChange,
            key: notifType,
            icon: iconMap[notifType] || 'Notifications',
            notificationType: notifType,
          };
        })}
      />
    </Card>
  );
}
