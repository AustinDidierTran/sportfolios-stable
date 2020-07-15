import React, { useState, useMemo, useEffect } from 'react';

import { Paper, Button } from '../../components/Custom';
import { Typography } from '../../components/MUI';
import { useTranslation } from 'react-i18next';
import Description from './Description';
import { formatRoute, goTo, ROUTES } from '../../actions/goTo';
import { formatDate } from '../../utils/stringFormats';
import { useParams } from 'react-router-dom';
import api from '../../actions/api';
import moment from 'moment';

export default function TabEventInfo() {
  const { t } = useTranslation();

  const { id } = useParams();

  const [options, setOptions] = useState([]);
  const [isFull, setIsFull] = useState(false);

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

  const isEarly = useMemo(() => {
    return options.every(
      option => moment(option.start_time) > moment(),
    );
  }, [options]);

  const isLate = useMemo(() => {
    return options.every(
      option => moment(option.end_time).add(24, 'hours') < moment(),
    );
  }, [options]);

  const getRegistrationStart = useMemo(() => {
    const startsDate = options.map(option =>
      moment(option.start_time),
    );
    return formatDate(moment.min(startsDate));
  }, [options]);

  const getRegistrationEnd = useMemo(() => {
    const endsDate = options.map(option => moment(option.end_time));
    return formatDate(moment.max(endsDate));
  }, [options]);

  useEffect(() => {
    getIsFull();
  }, [options]);

  const getIsFull = async () => {
    const { data } = await api(
      formatRoute('/api/entity/event', null, {
        eventId: id,
      }),
    );
    const { data: teams } = await api(
      formatRoute('/api/entity/allTeamsRegistered', null, {
        eventId: id,
      }),
    );
    setIsFull(teams.length >= data.maximum_spots);
  };

  if (isEarly) {
    return (
      <Paper title={t('info')}>
        <p>These are tournament informations</p>
        <Description />
        <Typography>
          {t('registrations_open_on')}&nbsp;{getRegistrationStart}
        </Typography>
      </Paper>
    );
  }

  if (isLate) {
    return (
      <Paper title={t('info')}>
        <p>These are tournament informations</p>
        <Description />
        <Typography>
          {t('registrations_ended')}&nbsp;{getRegistrationEnd}
        </Typography>
      </Paper>
    );
  }

  if (isFull) {
    return (
      <Paper title={t('info')}>
        <p>These are tournament informations</p>
        <Description />
        <Typography>{t('event_is_full')}</Typography>
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
