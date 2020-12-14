import React, { useContext } from 'react';
import styles from './More.module.css';
import history from '../../stores/history';
import { ROUTES } from '../../actions/goTo/index';
import { useTranslation } from 'react-i18next';
import { Store, ACTION_ENUM } from '../../Store';

import { Paper } from '../../components/Custom';
import { Typography } from '@material-ui/core';
import { GLOBAL_ENUM } from '../../../../common/enums';
import { formatRoute } from '../../../../common/utils/stringFormat';

export default function Menu() {
  const { dispatch } = useContext(Store);

  const { t } = useTranslation();

  const logout = () => dispatch({ type: ACTION_ENUM.LOGOUT });

  const data = [
    {
      name: t('settings'),
      route: ROUTES.userSettings,
    },
    {
      name: t('create_person'),
      route: formatRoute(
        ROUTES.create,
        {},
        { type: GLOBAL_ENUM.PERSON },
      ),
    },
    {
      name: t('create_event'),
      route: formatRoute(
        ROUTES.create,
        {},
        { type: GLOBAL_ENUM.EVENT },
      ),
    },
    {
      name: t('create_team'),
      route: formatRoute(
        ROUTES.create,
        {},
        { type: GLOBAL_ENUM.TEAM },
      ),
    },
    {
      name: t('create_organization'),
      route: formatRoute(
        ROUTES.create,
        {},
        { type: GLOBAL_ENUM.ORGANIZATION },
      ),
    },
    {
      name: t('logout'),
      function: logout,
      style: { color: 'red' },
    },
  ];
  return (
    <div className={styles.container}>
      {data.map((d, index) => (
        <Paper
          className={styles.card}
          onClick={
            d.function ||
            (() => {
              history.push(d.route);
            })
          }
          key={index}
        >
          <Typography style={d.style}>{d.name}</Typography>
        </Paper>
      ))}
    </div>
  );
}
