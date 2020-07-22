import React, { useMemo, useState } from 'react';

import { Tab, Tabs } from '../../../components/MUI';
import { Container, Paper } from '../../../components/Custom';

import styles from './Event.module.css';
import { useParams } from 'react-router-dom';
import { useQuery } from '../../../hooks/queries';

import { goTo, ROUTES } from '../../../actions/goTo';
import TabsGenerator, { TABS_ENUM } from '../../../tabs';

export default function Event(props) {
  const { basicInfos } = props;
  const { id } = useParams();
  const query = useQuery();

  const [eventState, setEventState] = useState(
    query.tab || TABS_ENUM.EVENT_INFO,
  );

  const states = TabsGenerator({
    list: [TABS_ENUM.EVENT_INFO, TABS_ENUM.SETTINGS],
    role: basicInfos.role,
  });

  const OpenTab = useMemo(
    () => states.find(s => s.value == eventState).component,
    [eventState, states],
  );

  const onClick = s => {
    goTo(ROUTES.entity, { id }, { tab: s.value });
    setEventState(s.value);
  };

  if (states.length == 1) {
    return (
      <Container className={styles.container}>
        <div className={styles.event}>
          <OpenTab basicInfos={basicInfos} />
        </div>
      </Container>
    );
  }

  return (
    <Container className={styles.container}>
      <div className={styles.event}>
        <Paper className={styles.card}>
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
        <OpenTab basicInfos={basicInfos} />
      </div>
    </Container>
  );
}
