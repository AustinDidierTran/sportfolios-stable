import React, { useMemo, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { Tab, Tabs } from '../../../components/MUI';
import { Paper, IgContainer } from '../../../components/Custom';
import { formatPageTitle } from '../../../utils/stringFormats';
import styles from './Person.module.css';

import TabsGenerator, { TABS_ENUM } from '../../../tabs';
import { goTo, ROUTES } from '../../../actions/goTo';

export default function Person(props) {
  const { basicInfos } = props;
  const { id } = useParams();

  useEffect(() => {
    document.title = formatPageTitle(basicInfos.name);
  }, [basicInfos]);

  const states = TabsGenerator({
    list: [TABS_ENUM.ABOUT, TABS_ENUM.EDIT_PERSON_INFOS],
    role: basicInfos.role,
  });

  const [eventState, setEventState] = useState(TABS_ENUM.ABOUT);

  const OpenTab = useMemo(
    () => states.find(s => s.value == eventState).component,
    [eventState, states],
  );

  const onClick = s => {
    goTo(ROUTES.entity, { id }, { tab: s.value });
    setEventState(s.value);
  };

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
