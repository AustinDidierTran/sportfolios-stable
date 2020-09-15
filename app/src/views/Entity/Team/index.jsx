import React, { useState, useEffect } from 'react';

import { Tab, Tabs } from '../../../components/MUI';
import { Paper, IgContainer } from '../../../components/Custom';

import styles from './Team.module.css';
import { useParams } from 'react-router-dom';
import { useQuery } from '../../../hooks/queries';

import BasicInfos from '../BasicInfos';
import { goTo, ROUTES } from '../../../actions/goTo';
import TabsGenerator, { TABS_ENUM } from '../../../tabs';
import { formatPageTitle } from '../../../utils/stringFormats';

export default function Team(props) {
  const { basicInfos } = props;
  const { id } = useParams();
  const query = useQuery();

  useEffect(() => {
    document.title = formatPageTitle(basicInfos.name);
  }, [basicInfos]);

  const isManager = id === id; //Need query to identify users that are managers

  const [eventState, setEventState] = useState(
    query.tab || TABS_ENUM.ABOUT,
  );

  const states = TabsGenerator({
    list: [TABS_ENUM.ABOUT, TABS_ENUM.SETTINGS],
  });

  const OpenTab = states.find(s => s.value == eventState).component;

  const onClick = s => {
    goTo(ROUTES.entity, { id }, { tab: s.value });
    setEventState(s.value);
  };

  return (
    <IgContainer className={styles.container}>
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
              onClick={() => onClick(s)}
              label={s.label}
              icon={s.icon}
            />
          ))}
        </Tabs>
      </Paper>
      <Paper className={styles.card}>
        <BasicInfos basicInfos={basicInfos} isManager={isManager} />
      </Paper>
      <OpenTab basicInfos={basicInfos} />
    </IgContainer>
  );
}
