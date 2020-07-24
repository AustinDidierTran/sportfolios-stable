import React, {
  useState,
  useMemo,
  useEffect,
  useContext,
} from 'react';

import {
  Paper,
  Button,
  CardMedia,
  ContainerBottomFixed,
} from '../../components/Custom';
import { Typography } from '../../components/MUI';
import { useTranslation } from 'react-i18next';
import Description from './Description';
import { formatRoute, goTo, ROUTES } from '../../actions/goTo';
import {
  formatIntervalDate,
  formatDate,
} from '../../utils/stringFormats';
import { useParams } from 'react-router-dom';
import api from '../../actions/api';
import moment from 'moment';
import styles from './EventInfo.module.css';
import { CardContent } from '@material-ui/core';
import { Store, ACTION_ENUM } from '../../Store';

const getEvent = async eventId => {
  const { data } = await api(
    formatRoute('/api/entity/eventInfos', null, {
      id: eventId,
    }),
  );
  return data;
};

export default function TabEventInfo() {
  const { t } = useTranslation();
  const { dispatch } = useContext(Store);
  const { id } = useParams();
  const {
    state: { authToken },
  } = useContext(Store);
  const isAuthenticated = Boolean(authToken);
  const [options, setOptions] = useState([]);
  const [isFull, setIsFull] = useState(false);
  const [event, setEvent] = useState({});
  const [canRegister, setCanRegister] = useState(false);

  const goToRegistration = () => {
    if (isAuthenticated) {
      goTo(ROUTES.eventRegistration, { id });
    } else {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: t('you_need_to_create_an_account'),
        severity: 'info',
      });
      goTo(ROUTES.login, null, {
        successRoute: `/eventRegistration/${id}`,
      });
    }
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

  const getData = async () => {
    const event = await getEvent(id);
    setEvent(event);
  };

  useEffect(() => {
    getData();
  }, []);

  const getDate = () => {
    return formatIntervalDate(
      moment(event.startDate),
      moment(event.endDate),
    );
  };

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
    if (!data || !data.maximum_spots) {
      setIsFull(false);
    } else {
      setIsFull(teams.length >= data.maximum_spots);
    }
  };

  const Problems = () => {
    if (options.length < 1) {
      return (
        <Paper className={styles.paper}>
          <Typography align="center">
            {t('registrations_closed_for_now')}
          </Typography>
        </Paper>
      );
    } else if (isFull) {
      setCanRegister(false);
      return (
        <Paper className={styles.paper}>
          <Typography align="center">{t('event_is_full')}</Typography>
        </Paper>
      );
    } else if (isLate) {
      setCanRegister(false);
      return (
        <Paper className={styles.paper}>
          <Typography align="center">
            {t('registrations_ended')}&nbsp;{getRegistrationEnd}
          </Typography>
        </Paper>
      );
    } else if (isEarly) {
      setCanRegister(false);
      return (
        <Paper className={styles.paper}>
          <Typography align="center">
            {t('registrations_open_on')}&nbsp;{getRegistrationStart}
          </Typography>
        </Paper>
      );
    } else {
      setCanRegister(true);
      return null;
    }
  };

  return (
    <div className={canRegister ? styles.event : styles.event1}>
      <div className={styles.infos}>
        <Paper className={styles.paper}>
          <CardMedia
            onClick={() => goTo(ROUTES.entity, { id })}
            photoUrl={event.photoUrl || ''}
            className={styles.media}
          />
          <CardContent className={styles.content}>
            <Typography>{event.name}</Typography>
            <Typography
              variant="body2"
              color="textSecondary"
              component="p"
            >
              {(event.quickDescription &&
                decodeURIComponent(event.quickDescription)) ||
                '5v5 mixte sous la formule à bout de souffle!'}
            </Typography>
            <Typography
              variant="body2"
              color="textSecondary"
              component="p"
            >
              {getDate()}
            </Typography>
            <Typography
              variant="body2"
              color="textSecondary"
              component="p"
            >
              {event.location || 'Sherbrooke'}
            </Typography>
          </CardContent>
        </Paper>
      </div>
      <div className={styles.problems}>
        <Problems />
      </div>
      <div className={styles.description}>
        <Description description={event.description} />
      </div>

      <ContainerBottomFixed>
        <div className={styles.buttonDiv}>
          {canRegister ? (
            <Button
              size="small"
              variant="contained"
              endIcon="SupervisedUserCircle"
              style={{ margin: '8px' }}
              onClick={goToRegistration}
              className={styles.button}
              hidden
            >
              {t('register')}
            </Button>
          ) : (
            <></>
          )}
        </div>
      </ContainerBottomFixed>
    </div>
  );
}
