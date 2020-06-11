import React, { useState } from 'react';

import General from './General';
import OrganizationList from './OrganizationList';
import { Container, Tab, Tabs } from '../../components/MUI';

import styles from './Main.module.css';
import { Paper } from '../../components/Custom';

const TABS_ENUM = {
  GENERAL: 'general',
  ORGANIZATIONS: 'organizations',
};

export default function Main(props) {
  const [eventState, setEventState] = useState(TABS_ENUM.GENERAL);
  const states = [
    {
      value: TABS_ENUM.GENERAL,
      component: <General />,
      label: 'General',
      icon: 'Folder',
    },
    {
      value: TABS_ENUM.ORGANIZATIONS,
      component: <OrganizationList />,
      label: 'Organization',
      icon: 'Business',
    },
  ];
  const OpenTab = states.find(s => s.value == eventState).component;

  return [
    <Paper>
      <Tabs
        indicatorColor="primary"
        textColor="primary"
        value={states.findIndex(s => s.value === eventState)}
      >
        {states.map((s, index) => (
          <Tab
            key={index}
            label={s.label}
            icon={s.icon}
            onClick={() => setEventState(s.value)}
          />
        ))}
      </Tabs>
    </Paper>,
    <Container className={styles.container}>{OpenTab}</Container>,
  ];
}
