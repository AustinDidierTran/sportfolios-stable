import React, { useState } from 'react';

import { Tab, Tabs } from '../../../components/MUI';
import { Container, Paper } from '../../../components/Custom';

import styles from './Organization.module.css';
import { useParams } from 'react-router-dom';
import { useQuery } from '../../../hooks/queries';
import TabsGenerator, { TABS_ENUM } from '../../../tabs';

import BasicInfos from '../BasicInfos';
import { goTo, ROUTES } from '../../../actions/goTo';

export default function Organization(props) {
  const { basicInfos } = props;
  const { id } = useParams();
  const query = useQuery();

  const [eventState, setEventState] = useState(
    query.tab || TABS_ENUM.ABOUT,
  );

  const states = TabsGenerator({
    list: [
      TABS_ENUM.EVENTS,
      // TABS_ENUM.GENERAL,
      TABS_ENUM.ABOUT,
      TABS_ENUM.SHOP,
      TABS_ENUM.SETTINGS,
    ],
    role: basicInfos.role,
  });

  const OpenTab = states.find(s => s.value == eventState).component;

  const onClick = s => {
    goTo(ROUTES.entity, { id }, { tab: s.value });
    setEventState(s.value);
  };

  return (
    <Container className={styles.container}>
      <Paper className={styles.card}>
        <Container className={styles.title}>
          <BasicInfos basicInfos={basicInfos} />
        </Container>
        <Tabs
          value={states.findIndex(s => s.value === eventState)}
          indicatorColor="primary"
          textColor="primary"
          className={styles.tabs}
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
      <OpenTab basicInfos={basicInfos} />
    </Container>
  );
}
