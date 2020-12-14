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
  STATUS_ENUM,
} from '../../../../../../common/enums';
import api from '../../../../actions/api';
import { formatRoute } from '../../../../actions/goTo';
import { ACTION_ENUM, Store } from '../../../../Store';
import { Typography } from '../../../../components/MUI';

import styles from '../HeaderFlyout.module.css';

export default function Notifications(props) {
  const { isMobileView } = props;
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
    if (!element) {
      return;
    }

    const hasOverflowingChildren =
      element.offsetHeight < element.scrollHeight;
    if (!hasOverflowingChildren) {
      loadMoreItems();
    }
  }, [div.current]);

  const getNotifications = async () => {
    const { status, data } = await api(
      formatRoute('/api/notifications/all', null, {
        currentPage: currentPage.current,
        perPage: 5,
      }),
    );

    if (status === STATUS_ENUM.ERROR) {
      return;
    }

    if (data.length) {
      setNotifications(notifications => [...notifications, ...data]);
    } else {
      setHasMoreItem(false);
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
    if (isMobileView) {
      for (let i = 1; i < 5; i++) {
        items.push({
          type: LIST_ITEM_ENUM.AVATAR_TEXT_SKELETON,
          key: `skeleton${i}`,
        });
      }
    }
  }

  if (!notifications || !notifications.length) {
    return (
      <div
        className={
          isMobileView
            ? styles.mobileNotificationsContainer
            : styles.notificationsContainer
        }
      >
        <Typography align="center" variant="body2">
          <b>{t('no_notifications')}</b>
          <br />
          {t('no_notifications_message')}
        </Typography>
      </div>
    );
  }

  return (
    <div
      className={
        isMobileView
          ? styles.mobileNotificationsContainer
          : styles.notificationsContainer
      }
      ref={div}
      onScroll={scrollHandler}
    >
      <List items={items} />
    </div>
  );
}
