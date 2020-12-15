import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import { Paper, Typography } from '@material-ui/core';

import Create from './Create';
import Notifications from './Notifications';
import Account from './Account';

import { ACTION_ENUM, Store } from '../../../Store';
import { HEADER_FLYOUT_TYPE_ENUM } from '../../../../../common/enums';
import { useTranslation } from 'react-i18next';
import styles from './HeaderFlyout.module.css';

export default function HeaderFlyout(props) {
  const { refCreateEntity, refNotifications, refAccount } = props;
  const {
    state: { flyoutType },
    dispatch,
  } = useContext(Store);
  const { t } = useTranslation();

  const ref = useRef(null);

  const handleClick = useCallback(
    e => {
      if (
        ref.current &&
        !ref.current.contains(e.target) &&
        refCreateEntity.current &&
        !refCreateEntity.current.contains(e.target) &&
        refNotifications.current &&
        !refNotifications.current.contains(e.target) &&
        refNotifications.current &&
        !refAccount.current.contains(e.target)
      ) {
        dispatch({
          type: ACTION_ENUM.HEADER_FLYOUT,
          flyoutType: HEADER_FLYOUT_TYPE_ENUM.CLOSED,
        });
      }
    },
    [flyoutType],
  );

  useEffect(() => {
    window.addEventListener('click', handleClick);
    return () => {
      window.removeEventListener('click', handleClick);
    };
  }, []);

  const flyout = useMemo(() => {
    switch (flyoutType) {
      case HEADER_FLYOUT_TYPE_ENUM.CREATE:
        return <Create />;
      case HEADER_FLYOUT_TYPE_ENUM.NOTIFICATIONS:
        return <Notifications />;
      case HEADER_FLYOUT_TYPE_ENUM.ACCOUNT:
        return <Account />;

      default:
        return;
    }
  }, [flyoutType]);

  if (flyoutType !== HEADER_FLYOUT_TYPE_ENUM.CLOSED) {
    return (
      <Paper ref={ref} className={styles.flyout}>
        <div className={styles.title}>
          <Typography variant="h5">{t(flyoutType)}</Typography>
        </div>
        {flyout}
      </Paper>
    );
  }

  return <></>;
}
