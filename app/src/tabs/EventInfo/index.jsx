import React from 'react';

import { Paper, Button } from '../../components/Custom';
import { useTranslation } from 'react-i18next';
import Description from './Description';
import { goTo, ROUTES } from '../../actions/goTo';
import { useParams } from 'react-router-dom';

export default function TabEventInfo() {
  const { t } = useTranslation();

  const { id } = useParams();

  const goToRegistration = () => {
    goTo(ROUTES.eventRegistration, { id });
  };

  return (
    <Paper title={t('info')}>
      <p>These are tournament informations</p>
      <Description />
      <Button
        size="small"
        variant="contained"
        endIcon="SupervisedUserCircle"
        style={{ margin: '8px' }}
        onClick={goToRegistration}
      >
        {t('register')}
      </Button>
    </Paper>
  );
}
