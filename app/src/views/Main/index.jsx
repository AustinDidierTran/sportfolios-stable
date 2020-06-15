import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import General from './General';
import OrganizationList from './OrganizationList';
import TeamList from './TeamList';
import { Container, Tab, Tabs } from '../../components/MUI';

import styles from './Main.module.css';
import { Paper } from '../../components/Custom';

const TABS_ENUM = {
  GENERAL: 'general',
  ORGANIZATIONS: 'organizations',
  TEAMS: 'teams',
};

export default function Main() {
  const { t } = useTranslation();

  const [eventState, setEventState] = useState(TABS_ENUM.GENERAL);
  const states = [
    {
      value: TABS_ENUM.GENERAL,
      component: <General />,
      label: t('general'),
      icon: 'Folder',
    },
    {
      value: TABS_ENUM.ORGANIZATIONS,
      component: <OrganizationList />,
      label: t('organizations'),
      icon: 'Business',
    },
    {
      value: TABS_ENUM.TEAMS,
      component: <TeamList />,
      label: t('teams'),
      icon: 'SportsKabaddi',
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
