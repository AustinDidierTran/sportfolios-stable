import React, { useMemo, useState, useEffect } from 'react';
import { Tab, Tabs } from '../../../components/MUI';
import { Container, Paper } from '../../../components/Custom';
import styles from './Person.module.css';
import BasicInfos from './BasicInfos';
import TabsGenerator, { TABS_ENUM } from '../../../tabs';
import { formatPageTitle } from '../../../utils/stringFormats';

export default function Person(props) {
  const { basicInfos } = props;

  useEffect(() => {
    document.title = formatPageTitle(basicInfos.name);
  }, [basicInfos]);

  const [eventState, setEventState] = useState(TABS_ENUM.ABOUT);

  const states = TabsGenerator({
    list: [TABS_ENUM.ABOUT],
    role: basicInfos.role,
  });

  const OpenTab = useMemo(
    () => states.find(s => s.value == eventState).component,
    [eventState, states],
  );

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
      <OpenTab basicInfos={basicInfos} />
    </Container>
  );
}
