import React, { useMemo, useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { Paper } from '../../../../components/MUI';

import styles from './NotificationModule.module.css';
import { Typography } from '../../../../components/MUI/';
import { List } from '../../../../components/Custom';
import { LIST_ITEM_ENUM } from '../../../../../../common/enums';
import { formatRoute } from '../../../../actions/goTo';
import api from '../../../../actions/api';

export default function NotificationList(props) {
  const { closeNotificationModule, open } = props;
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMoreItem, setHasMoreItem] = useState(true);
  const currentPage = useRef(1);
  const div = useRef();

  function scrollHandler(e) {
    let element = e.target;
    if (
      element.scrollHeight - element.scrollTop ===
        element.clientHeight &&
      hasMoreItem
    ) {
      //user is at the end of the list so load more items
      loadMoreItems();
    }
  }

  function loadMoreItems() {
    currentPage.current += 1;
    getNotifications();
  }

  useEffect(() => {
    const element = div.current;
    if (element) {
      const hasOverflowingChildren =
        element.offsetHeight < element.scrollHeight;
      if (!hasOverflowingChildren) {
        loadMoreItems();
      }
    }
  });

  const onOpen = async () => {
    if (open) {
      setIsLoading(true);
      await getNotifications();
      setIsLoading(false);
    } else {
      currentPage.current = 1;
      setNotifications([]);
      setHasMoreItem(true);
    }
  };

  const getNotifications = async () => {
    const { data } = await api(
      formatRoute('/api/notifications/all', null, {
        currentPage: currentPage.current,
        perPage: 5,
      }),
    );
    if (data) {
      if (data.length > 0) {
        setNotifications(notifications => [
          ...notifications,
          ...data,
        ]);
      } else {
        setHasMoreItem(false);
      }
    }
  };

  useMemo(() => onOpen(), [open]);

  if (isLoading) {
    return (
      <Paper className={styles.paper}>
        <List
          title={t('notifications')}
          items={[
            {
              type: LIST_ITEM_ENUM.AVATAR_TEXT_SKELETON,
              key: '0',
              quantity: 4,
            },
          ]}
        />
      </Paper>
    );
  }
  let items = notifications.map(notif => ({
    ...notif,
    key: notif.id,
    onClick: closeNotificationModule,
  }));
  if (hasMoreItem) {
    items.push({
      type: LIST_ITEM_ENUM.AVATAR_TEXT_SKELETON,
      key: 'skeleton',
    });
  }

  return open ? (
    <Paper className={styles.paper}>
      {notifications?.length > 0 ? (
        <div
          ref={div}
          onScroll={scrollHandler}
          className={styles.listContainer}
        >
          <List title={t('notifications')} items={items} />
        </div>
      ) : (
        <Typography align="center" variant="body2">
          <b>{t('no_notifications')}</b>
          <br />
          {t('no_notifications_message')}
        </Typography>
      )}
    </Paper>
  ) : (
    <></>
  );
}
