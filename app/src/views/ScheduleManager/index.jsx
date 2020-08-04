import React from 'react';
import { IgContainer } from '../../components/Custom';
import { useTranslation } from 'react-i18next';
import { Typography } from '@material-ui/core';
import AddTeams from './AddTeams';

export default function ScheduleManager() {
  const { t } = useTranslation();

  return (
    <IgContainer>
      <Typography variant="h4" component="p">
        {t('Welcome to the tournament')}
      </Typography>
      <AddTeams />
    </IgContainer>
  );
}
