import React, { useState, useEffect } from 'react';

import { Tab, Tabs } from '../../../components/MUI';
import { Paper, IgContainer } from '../../../components/Custom';

import styles from './Organization.module.css';
import { useParams } from 'react-router-dom';
import { useQuery } from '../../../hooks/queries';
import TabsGenerator, { TABS_ENUM } from '../../../tabs';

import BasicInfos from '../Person/BasicInfos';
import { goTo, ROUTES } from '../../../actions/goTo';
import { formatPageTitle } from '../../../utils/stringFormats';

export default function Organization(props) {
  const { basicInfos } = props;
  const { id } = useParams();
  const query = useQuery();

  useEffect(() => {
    document.title = formatPageTitle(basicInfos.name);
  }, [basicInfos]);

  const [eventState, setEventState] = useState(
    query.tab || TABS_ENUM.EVENTS,
  );

  const states = TabsGenerator({
    list: [TABS_ENUM.EVENTS, TABS_ENUM.SETTINGS],
    role: basicInfos.role,
  });

  const OpenTab =
    states.find(s => s.value == eventState).component ||
    states.find(s => s.value === TABS_ENUM.EVENTS).component;

  const onClick = s => {
    goTo(ROUTES.entity, { id }, { tab: s.value });
    setEventState(s.value);
  };

  return (
    <IgContainer>
      <Paper className={styles.card}>
        <BasicInfos basicInfos={basicInfos} />
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
    </IgContainer>
  );
}
