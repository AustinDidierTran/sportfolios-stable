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
};

const titleMap = {
  [NOTIFICATION_TYPE.ADDED_TO_ROSTER]: 'added_to_roster',
};

const descriptionMap = {
  [NOTIFICATION_TYPE.ADDED_TO_ROSTER]: 'added_to_roster_description',
};
export default function Notifications() {
  const { t } = useTranslation();
  const [switchesState, setSwitchesState] = useState({});
  const [settings, setSettings] = useState([]);
  const [chatbotDisabled, setChatbotDisabled] = useState(false);

  const getStateKey = (type, media) => {
    return type + ' ' + media;
  };

  const handleChange = ({ type, media, enabled }) => {
    setSwitchesState(prev => {
      return {
        ...prev,
        [getStateKey(type, media)]: enabled,
      };
    });
    api('/api/notifications/settings', {
      method: 'PUT',
      body: JSON.stringify({
        type,
        media,
        enabled,
      }),
    });
  };

  const fetchSettings = async () => {
    const { data } = await api('/api/notifications/settings/all');
    if (!data) {
      return;
    }
    const { chatbotDisabled, notifications } = data;
    const tempState = {};
    notifications.forEach(s => {
      tempState[getStateKey(s.type, NOTIFICATION_MEDIA.EMAIL)] =
        s.email;
      tempState[getStateKey(s.type, NOTIFICATION_MEDIA.CHATBOT)] =
        !chatbotDisabled && s.chatbot;
    });
    setSettings(notifications);
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
        items={settings.map(s => {
          return {
            type: LIST_ITEM_ENUM.NOTIFICATION_SETTING,
            email:
              switchesState[
                getStateKey(s.type, NOTIFICATION_MEDIA.EMAIL)
              ],
            chatbot:
              switchesState[
                getStateKey(s.type, NOTIFICATION_MEDIA.CHATBOT)
              ],
            chatbotDisabled: chatbotDisabled,
            name: t(titleMap[s.type]),
            description: t(descriptionMap[s.type]),
            onChange: handleChange,
            key: s.type,
            icon: iconMap[s.type],
            notificationType: s.type,
          };
        })}
      />
    </Card>
  );
}
