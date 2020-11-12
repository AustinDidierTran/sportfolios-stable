import React, {
  useRef,
  useEffect,
  useState,
  useContext,
} from 'react';
import api from '../../../../actions/api';
import NotificationList from './NotificationList';

import styles from './NotificationModule.module.css';
import { IconButton } from '../../../../components/Custom';
import { Badge } from '../../../../components/MUI';
import {
  STATUS_ENUM,
  SOCKET_EVENT,
} from '../../../../../../common/enums';
import { Store } from '../../../../Store';

export default function NotificationModule() {
  const {
    state: { socket },
  } = useContext(Store);
  const [open, setOpen] = useState(false);
  const [
    unreadNotificationsCount,
    setUnreadNotificationsCount,
  ] = useState(0);

  socket.on(SOCKET_EVENT.NOTIFICATIONS, count => {
    setUnreadNotificationsCount(count);
  });

  const node = useRef();

  const handleClick = e => {
    if (!node || !node.current || !node.current.contains(e.target)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClick);

    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, []);

  const toggleNotification = () => {
    api('/api/notifications/see', {
      method: 'PUT',
    });
    setUnreadNotificationsCount(0);
    setOpen(!open);
  };

  const closeNotificationModule = () => setOpen(false);

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
    <div className={styles.root} ref={node}>
      <Badge badgeContent={unreadNotificationsCount} color="error">
        <IconButton
          aria-label={`show ${unreadNotificationsCount} new notifications`}
          color="inherit"
          onClick={toggleNotification}
          icon="Notifications"
        />
      </Badge>
      <div className={styles.module}>
        <NotificationList
          closeNotificationModule={closeNotificationModule}
          open={open}
        />
      </div>
    </div>
  );
}
