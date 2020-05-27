import React, { useState } from 'react';

import { Button, Typography, Tab, Tabs } from '../../components/MUI';
import { Container, Paper } from '../../components/Custom';

import styles from './Event.module.css';
import Schedule from './Schedule';
import Infos from './Infos';
import Ranking from './Ranking';
import { useTranslation } from 'react-i18next';

export const TABS_ENUM = {
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

  const [isRegistered, setIsRegistered] = useState(true);

  const registerClick = () => {
    setIsRegistered(!isRegistered);
  };

  const [eventState, setEventState] = useState(openTab);

  const states = [
    {
      value: TABS_ENUM.SCHEDULE,
      component: Schedule,
      label: t('schedule'),
      icon: 'Event',
    },
    {
      value: TABS_ENUM.RANKING,
      component: Ranking,
      label: t('ranking'),
      icon: 'EmojiEvents',
    },
    {
      value: TABS_ENUM.INFOS,
      component: Infos,
      label: 'Infos',
      icon: 'Info',
    },
  ];
  const OpenTab = states.find(s => s.value == eventState).component;

  const data = {
    name: 'Frisbee Fest',
    startDate: '30',
    endDate: '31',
    Month: 'Mai',
    City: 'Trois-Rivières',
  };
  return (
    <Container className={styles.container}>
      <Paper className={styles.card}>
        <Container className={styles.titre}>
          <Typography variant="h3">{data.name}</Typography>
          <Typography variant="h5">
            {data.startDate}-{data.endDate} {data.Month}
          </Typography>
          <Typography variant="h5">{data.City}</Typography>
          {isRegistered ? (
            <Button
              variant="contained"
              onClick={registerClick}
              className={styles.button}
              color="primary"
            >
              {t('registration')}
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={registerClick}
              className={styles.button}
            >
              {t('registered')}
            </Button>
          )}
        </Container>
        <Paper square>
          <Tabs
            value={states.findIndex(s => s.value === eventState)}
            indicatorColor="primary"
            textColor="primary"
            className={styles.tabs}
            centered
          >
            {states.map((s, index) => (
              <Tab
                key={index}
                label={s.label}
                onClick={() => setEventState(s.value)}
                icon={s.icon}
              />
            ))}
          </Tabs>
        </Paper>
      </Paper>
      <OpenTab />
    </Container>
  );
}
