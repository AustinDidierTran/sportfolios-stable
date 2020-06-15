import React, { useState } from 'react';

import { Tab, Tabs } from '../../../components/MUI';
import { Container, Paper } from '../../../components/Custom';

import styles from './Team.module.css';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useQuery } from '../../../hooks/queries';

import BasicInfos from '../BasicInfos';
import NextEvents from '../NextEvents';
import Shop from '../Shop';
import About from '../About';
import Settings from '../Settings';
import { goTo, ROUTES } from '../../../actions/goTo';

export const TABS_ENUM = {
  GENERAL: 'general',
  ABOUT: 'about',
  SHOP: 'shop',
  SETTINGS: 'settings',
};

export default function Team(props) {
  const { basicInfos } = props;

  const { t } = useTranslation();
  const { id } = useParams();
  const query = useQuery();

  const isManager = id === id; //Need query to identify users that are managers

  const [eventState, setEventState] = useState(
    query.tab || TABS_ENUM.GENERAL,
  );

  const states = [
    {
      value: TABS_ENUM.GENERAL,
      component: NextEvents,
      label: t('general'),
      icon: 'Folder',
    },
    {
      value: TABS_ENUM.ABOUT,
      component: About,
      label: t('about'),
      icon: 'Info',
    },
    {
      value: TABS_ENUM.SHOP,
      component: Shop,
      label: t('shop'),
      icon: 'Store',
    },
    {
      value: TABS_ENUM.SETTINGS,
      component: Settings,
      label: t('settings'),
      icon: 'Settings',
    },
  ];

  const OpenTab = states.find(s => s.value == eventState).component;

  const onClick = s => {
    goTo(ROUTES.entity, { id }, { tab: s.value });
    setEventState(s.value);
  };

  return (
    <Container className={styles.container}>
      <Paper className={styles.card}>
        <Container className={styles.title}>
          <BasicInfos basicInfos={basicInfos} isManager={isManager} />
        </Container>
        <Tabs
          value={states.findIndex(s => s.value === eventState)}
          indicatorColor="primary"
          textColor="primary"
          className={styles.tabs}
          // centered
        >
          {states.map((s, index) => (
            <Tab
              key={index}
              onClick={() => onClick(s)}
              label={s.label}
              icon={s.icon}
            />
          ))}
        </Tabs>
      </Paper>
      <OpenTab />
    </Container>
  );
}
