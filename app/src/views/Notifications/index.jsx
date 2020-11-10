import React, { useState, useEffect } from 'react';
import api from '../../actions/api';
import { IgContainer } from '../../components/Custom';
import NotificationList from '../Header/LoggedIn/NotificationModule/NotificationList';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);

  const updateNotifications = async () => {
    const { data } = await api(`/api/notifications/all`);
    setNotifications(data);
  };

  useEffect(() => {
    api('/api/notifications/see', {
      method: 'PUT',
    });
    updateNotifications();
  }, []);

  return (
    <IgContainer>
      <NotificationList
        notifications={notifications}
        open
      ></NotificationList>
    </IgContainer>
  );
}
