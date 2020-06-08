import React, { useContext, useState, useEffect } from 'react';
import { Tab, Tabs } from '../../components/MUI';
import { Container, Paper } from '../../components/Custom';
import { Store } from '../../Store';
import styles from './Profile.module.css';
import BasicInfos from './BasicInfos';
import General from './General';
import Shop from './Shop';
import About from './About';
import api from '../../actions/api';
import { CLIENT_BASE_URL } from '../../../../conf';
import { Link } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

export const TABS_ENUM = {
  GENERAL: 'general',
  ABOUT: 'about',
  SHOP: 'shop',
};

export default function Profile(props) {
  const [basicInfos, setBasicInfos] = useState({});
  const { t } = useTranslation();

  const [eventState, setEventState] = useState(TABS_ENUM.GENERAL);

  const updateBasicInfos = async () => {
    const { data } = await api(
      `/api/profile/userInfo/8317ff33-3b04-49a1-afd3-420202cddf73`,
    );

    setBasicInfos(data);
  };

  useEffect(() => {
    updateBasicInfos();
  }, []);

  const {
    state: { userInfo },
  } = useContext(Store);

  const user_id = userInfo && userInfo.user_id;

  const {
    match: {
      params: { id },
    },
  } = props;

  const isSelf = id === user_id;

  const states = [
    {
      value: TABS_ENUM.GENERAL,
      component: <General isSelf={isSelf} />,
      label: t('general'),
      icon: 'Folder',
    },
    {
      value: TABS_ENUM.ABOUT,
      component: <About />,
      label: t('about'),
      icon: 'Info',
    },
    {
      value: TABS_ENUM.SHOP,
      component: <Shop />,
      label: t('shop'),
      icon: 'ShoppingCart',
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
      {OpenTab}
    </Container>
  );
}
