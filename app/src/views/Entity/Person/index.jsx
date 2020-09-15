import React, { useMemo, useState, useEffect } from 'react';
import { Tab, Tabs } from '../../../components/MUI';
import { Paper, IgContainer } from '../../../components/Custom';
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
    <IgContainer>
      <Paper>
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
      <Paper className={styles.card}>
        <BasicInfos basicInfos={basicInfos} />
      </Paper>
      <OpenTab basicInfos={basicInfos} />
    </IgContainer>
  );
}
