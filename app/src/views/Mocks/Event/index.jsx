import React, { useState } from 'react';

import { Container, Typography } from '../../../components/MUI';
import { Paper } from '../../../components/Custom';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import styles from './Event.module.css';
import Schedule from './Schedule';
import Infos from './Infos';
import Ranking from './Ranking';
import { useTranslation } from 'react-i18next';

export const TABS_ENUM = {
  REGISTER: 'register',
  SCHEDULE: 'schedule',
  RANKING: 'ranking',
  INFOS: 'infos',
};

export default function Event(props) {
  const { t } = useTranslation();

  const {
    match: {
      params: { openTab = TABS_ENUM.INFOS },
    },
  } = props;

  const [eventState, setEventState] = useState(openTab);

  const states = [
    {
      value: TABS_ENUM.REGISTER,
      component: Ranking,
      label: t('registration'),
    },
    {
      value: TABS_ENUM.SCHEDULE,
      component: Schedule,
      label: t('schedule'),
    },
    {
      value: TABS_ENUM.RANKING,
      component: Ranking,
      label: t('ranking'),
    },
    { value: TABS_ENUM.INFOS, component: Infos, label: 'Infos' },
  ];
  const OpenTab = states.find(s => s.value == eventState).component;

  return (
    <Container className={styles.container}>
      <Paper className={styles.card}>
        <Container className={styles.titre}>
          <Typography variant="h3">Frisbee Fest</Typography>
          <Typography variant="h5">30-31 Mai</Typography>
          <Typography variant="h5">Trois-Rivières</Typography>
        </Container>
        <Paper square>
          <Tabs
            value={Object.values(TABS_ENUM).indexOf(eventState)}
            indicatorColor="primary"
            textColor="primary"
            className={styles.tabs}
            centered
          >
            {states.map((s, index) => (
              <Tab
                label={s.label}
                onClick={() => setEventState(s.value)}
                key={index}
              />
            ))}
          </Tabs>
        </Paper>
      </Paper>
      <OpenTab />
    </Container>
  );
}
