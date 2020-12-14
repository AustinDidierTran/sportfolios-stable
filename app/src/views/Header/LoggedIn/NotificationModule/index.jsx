import React, { useEffect, useState, useContext } from 'react';
import api from '../../../../actions/api';
import { IconButton } from '../../../../components/Custom';
import {
  STATUS_ENUM,
  SOCKET_EVENT,
} from '../../../../../../common/enums';
import { Store } from '../../../../Store';
import { useTranslation } from 'react-i18next';

export default function NotificationModule(props) {
  const { className, onClick } = props;
  const {
    state: { socket },
  } = useContext(Store);
  const { t } = useTranslation();

  const [
    unreadNotificationsCount,
    setUnreadNotificationsCount,
  ] = useState(0);

  socket.on(SOCKET_EVENT.NOTIFICATIONS, count => {
    setUnreadNotificationsCount(count);
  });

  const toggleNotification = () => {
    api('/api/notifications/see', {
      method: 'PUT',
    });
    setUnreadNotificationsCount(0);
    onClick();
  };

  const getNotificationCount = async () => {
    const res = await api('/api/notifications/unseenCount');
    if (res.status == STATUS_ENUM.SUCCESS_STRING) {
      setUnreadNotificationsCount(Number(res.data));
    }
  };

  useEffect(() => {
    getNotificationCount();
  }, []);

  return (
    <IconButton
      className={className}
      onClick={toggleNotification}
      icon="Notifications"
      style={{ color: 'white' }}
      size="medium"
      tooltip={t('notifications')}
      withBadge
      badgeContent={unreadNotificationsCount}
      aria-label={`show ${unreadNotificationsCount} new notifications`}
    />
  );
}
