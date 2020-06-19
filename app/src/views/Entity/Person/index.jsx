import React, { useContext, useState } from 'react';
import { Tab, Tabs } from '../../../components/MUI';
import { Container, Paper } from '../../../components/Custom';
import { Store } from '../../../Store';
import styles from './Person.module.css';
import BasicInfos from './BasicInfos';
import General from './General';
import Shop from '../Shop';
import About from '../About';

import { useTranslation } from 'react-i18next';

export const TABS_ENUM = {
  GENERAL: 'general',
  ABOUT: 'about',
  SHOP: 'shop',
};

export default function Person(props) {
  const { basicInfos } = props;
  const { t } = useTranslation();

  const [eventState, setEventState] = useState(TABS_ENUM.GENERAL);

  const {
    state: { userInfo },
  } = useContext(Store);

  const personId = userInfo && userInfo.id;

  const isSelf = basicInfos.id === personId;

  const states = [
    {
      value: TABS_ENUM.GENERAL,
      component: General,
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
  ];

  const OpenTab = states.find(s => s.value == eventState).component;

  return (
    <Container className={styles.container}>
      <Paper className={styles.card}>
        <Container className={styles.title}>
          <BasicInfos isSelf={isSelf} basicInfos={basicInfos} />
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
      <OpenTab isSelf={isSelf} />
    </Container>
  );
}
