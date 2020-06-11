import React, { useContext } from 'react';
import styles from './More.module.css';
import history from '../../stores/history';
import { ROUTES } from '../../actions/goTo/index';
import { useTranslation } from 'react-i18next';
import { Store, ACTION_ENUM } from '../../Store';

import { Paper } from '../../components/Custom';
import { Typography } from '@material-ui/core';

export default function Menu(props) {
  const { dispatch } = useContext(Store);

  const { t } = useTranslation();

  const logout = () => dispatch({ type: ACTION_ENUM.LOGOUT });

  const data = [
    {
      name: t('organizations'),
      route: ROUTES.organizationList,
    },
    {
      name: t('settings'),
      route: ROUTES.userSettings,
    },
    {
      name: t('logout'),
      function: logout,
      style: { color: 'red' },
    },
  ];
  return (
    <div className={styles.container}>
      {data.map(d => (
        <Paper
          className={styles.card}
          onClick={
            d.function ||
            (() => {
              history.push(d.route);
            })
          }
        >
          <Typography style={d.style}>{d.name}</Typography>
        </Paper>
      ))}
    </div>
  );
}
