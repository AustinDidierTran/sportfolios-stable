import React, { useState } from 'react';

import {
  Container,
  Typography,
  Button,
} from '../../../components/MUI';
import { Paper } from '../../../components/Custom';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import styles from './Organization.module.css';
import { useTranslation } from 'react-i18next';
import BasicInfos from './BasicInfos';
import NextEvents from './NextEvents';
import Shop from './Shop';
import About from './About';

export const TABS_ENUM = {
  GENERAL: 'general',
  SHOP: 'shop',
  ABOUT: 'about',
};

export default function Organization(props) {
  const { t } = useTranslation();

  const {
    match: {
      params: { openTab = TABS_ENUM.GENERAL },
    },
  } = props;

  const [eventState, setEventState] = useState(openTab);

  const states = [
    {
      value: TABS_ENUM.GENERAL,
      component: NextEvents,
      label: t('general'),
    },
    {
      value: TABS_ENUM.SHOP,
      component: Shop,
      label: t('shop'),
    },
    {
      value: TABS_ENUM.ABOUT,
      component: About,
      label: t('about'),
    },
  ];
  const OpenTab = states.find(s => s.value == eventState).component;

  return (
    <Container className={styles.container}>
      <Paper className={styles.card}>
        <Container className={styles.titre}>
          <BasicInfos />
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
              />
            ))}
          </Tabs>
        </Paper>
      </Paper>
      <OpenTab />
    </Container>
  );
}
