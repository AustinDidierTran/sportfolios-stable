import React, { useState } from 'react';

import { Paper, Button } from '../../components/Custom';
import { Typography } from '../../components/MUI';
import { useTranslation } from 'react-i18next';
import Description from './Description';
import { formatRoute, goTo, ROUTES } from '../../actions/goTo';
import { useParams } from 'react-router-dom';
import api from '../../actions/api';
import { useEffect } from 'react';
import moment from 'moment';

export default function TabEventInfo() {
  const { t } = useTranslation();

  const { id } = useParams();

  const [options, setOptions] = useState([]);

  const goToRegistration = () => {
    goTo(ROUTES.eventRegistration, { id });
  };

  useEffect(() => {
    getOptions();
  }, [id]);

  const getOptions = async () => {
    const { data } = await api(
      formatRoute('/api/entity/options', null, { eventId: id }),
    );
    setOptions(data);
  };

  const isEarly = () => {
    return options.every(
      option => moment(option.start_time) > moment(),
    );
  };

  const isLate = () => {
    return options.every(
      option => moment(option.end_time).add(24, 'hours') < moment(),
    );
  };

  const getRegistrationStart = () => {
    const startsDate = options.map(option =>
      moment(option.start_time),
    );
    return moment.min(startsDate).format('LL');
  };

  const getRegistrationEnd = () => {
    const endsDate = options.map(option => moment(option.end_time));
    return moment.max(endsDate).format('LL');
  };

  if (isEarly()) {
    return (
      <Paper title={t('info')}>
        <p>These are tournament informations</p>
        <Description />
        <Typography>
          {t('registrations_open_on')} &nbsp;
          {getRegistrationStart()}
        </Typography>
      </Paper>
    );
  }

  if (isLate()) {
    return (
      <Paper title={t('info')}>
        <p>These are tournament informations</p>
        <Description />
        <Typography>
          {t('registrations_ended')}&nbsp;{getRegistrationEnd()}
        </Typography>
      </Paper>
    );
  }

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
