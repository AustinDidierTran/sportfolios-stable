import React, { useState, useContext, useEffect } from 'react';

import { Tab, Tabs } from '../../components/MUI';
import { Container, Paper } from '../../components/Custom';

import { Store } from '../../Store';
import api from '../../actions/api';
import styles from './Organization.module.css';
import { useTranslation } from 'react-i18next';
import BasicInfos from './BasicInfos';
import NextEvents from './NextEvents';
import Shop from './Shop';
import About from './About';

export const TABS_ENUM = {
  GENERAL: 'general',
  ABOUT: 'about',
  SHOP: 'shop',
};

export default function Organization(props) {
  const { t } = useTranslation();

  const [basicInfos, setBasicInfos] = useState({});

  const updateBasicInfos = async () => {
    const { data } = await api(`/api/organization?id=${id}`);

    setBasicInfos(data);
  };

  useEffect(() => {
    updateBasicInfos();
  }, []);

  const {
    match: {
      params: { id },
    },
  } = props;

  const {
    state: { organization },
  } = useContext(Store);

  const {
    match: {
      params: { openTab = TABS_ENUM.GENERAL },
    },
  } = props;

  const isManager = id === id; //Need query to identify users that are managers

  const [eventState, setEventState] = useState(openTab);

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
      icon: 'ShoppingCart',
    },
  ];

  const OpenTab = states.find(s => s.value == eventState).component;

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
              onClick={() => setEventState(s.value)}
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
