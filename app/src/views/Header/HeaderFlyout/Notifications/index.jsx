import React, {
  useRef,
  useState,
  useEffect,
  useContext,
} from 'react';
import { useTranslation } from 'react-i18next';
import { List } from '../../../../components/Custom';
import {
  LIST_ITEM_ENUM,
  HEADER_FLYOUT_TYPE_ENUM,
} from '../../../../../../common/enums';
import api from '../../../../actions/api';
import { formatRoute } from '../../../../actions/goTo';
import { ACTION_ENUM, Store } from '../../../../Store';
import { Typography } from '../../../../components/MUI';

import styles from '../HeaderFlyout.module.css';

export default function Notifications() {
  const { t } = useTranslation();
  const { dispatch } = useContext(Store);

  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMoreItem, setHasMoreItem] = useState(true);
  const currentPage = useRef(1);
  const div = useRef();

  const initialLoad = async () => {
    await getNotifications();
    setIsLoading(false);
  };

  useEffect(() => {
    initialLoad();
  }, []);

  function scrollHandler(e) {
    let element = e.target;
    if (
      element.scrollHeight - Math.ceil(element.scrollTop) <=
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

  const handleNotifClick = () => {
    dispatch({
      type: ACTION_ENUM.HEADER_FLYOUT,
      flyoutType: HEADER_FLYOUT_TYPE_ENUM.CLOSED,
    });
  };

  if (isLoading) {
    return (
      <div>
        <List
          items={[
            {
              type: LIST_ITEM_ENUM.AVATAR_TEXT_SKELETON,
              key: '0',
              quantity: 4,
            },
          ]}
        />
      </div>
    );
  }

  let items = notifications.map(notif => ({
    ...notif,
    key: notif.id,
    onClick: () => handleNotifClick(),
  }));

  if (hasMoreItem) {
    items.push({
      type: LIST_ITEM_ENUM.AVATAR_TEXT_SKELETON,
      key: 'skeleton',
    });
  }

  return (
    <div
      className={styles.notificationsContainer}
      ref={div}
      onScroll={scrollHandler}
    >
      {notifications?.length > 0 ? (
        <div>
          <List items={items} />
        </div>
      ) : (
        <Typography align="center" variant="body2">
          <b>{t('no_notifications')}</b>
          <br />
          {t('no_notifications_message')}
        </Typography>
      )}
    </div>
  );
}
