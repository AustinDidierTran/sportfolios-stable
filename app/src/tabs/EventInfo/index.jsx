import React, {
  useState,
  useMemo,
  useEffect,
  useContext,
} from 'react';

import {
  Paper,
  Button,
  ContainerBottomFixed,
  ImageCard,
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
  const [remainingSpots, setRemainingSpots] = useState(null);
  const [color, setColor] = useState('textSecondary');

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

  const RegistrationStart = useMemo(() => {
    const startsDate = options.map(option =>
      moment(option.start_time),
    );
    return formatDate(moment.min(startsDate));
  }, [options]);

  const registrationEnd = useMemo(() => {
    const endsDate = options.map(option => moment(option.end_time));
    return formatDate(moment.max(endsDate));
  }, [options]);

  useEffect(() => {
    getColor();
  }, [remainingSpots]);

  const getColor = () => {
    if (remainingSpots <= Math.ceil(event.maximumSpots * 0.2)) {
      setColor('secondary');
    } else {
      setColor('textSecondary');
    }
  };

  useEffect(() => {
    if (event.maximumSpots) {
      getRemainingSpots();
    }
  }, [event]);

  const getRemainingSpots = async () => {
    const { data } = await api(
      formatRoute('/api/entity/remainingSpots', null, {
        id,
      }),
    );
    setRemainingSpots(data);
  };

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
        <Typography
          variant="body2"
          color="textSecondary"
          component="p"
        >
          {t('registrations_closed_for_now')}
        </Typography>
      );
    } else if (isFull) {
      setCanRegister(false);
      return (
        <Typography
          variant="body2"
          color="textSecondary"
          component="p"
        >
          {t('event_is_full')}
        </Typography>
      );
    } else if (isLate) {
      setCanRegister(false);
      return (
        <Typography
          variant="body2"
          color="textSecondary"
          component="p"
        >
          {t('registrations_ended')}&nbsp;{registrationEnd}
        </Typography>
      );
    } else if (isEarly) {
      setCanRegister(false);
      return (
        <>
          <Typography
            variant="body2"
            color="textSecondary"
            component="p"
          >
            {t('registrations_open_on')}&nbsp;{RegistrationStart}
          </Typography>
          <Typography
            variant="body2"
            color="textSecondary"
            component="p"
          >
            {t('registrations_ends_on')}&nbsp;
            {registrationEnd}
          </Typography>
        </>
      );
    } else {
      setCanRegister(true);
      return (
        <Typography
          variant="body2"
          color="textSecondary"
          component="p"
        >
          {t('registrations_ends_on')}&nbsp;
          {registrationEnd}
        </Typography>
      );
    }
  };

  return (
    <div className={canRegister ? styles.event : styles.event1}>
      <div className={styles.infos}>
        <Paper className={styles.paper}>
          <ImageCard
            onClick={() => goTo(ROUTES.entity, { id })}
            photoUrl={event.photoUrl || ''}
            className={styles.media}
          />
          <CardContent className={styles.content}>
            <Typography className={styles.name}>
              {event.name}
            </Typography>
            {event.quickDescription ? (
              <Typography
                variant="body2"
                color="textSecondary"
                component="p"
              >
                {decodeURIComponent(event.quickDescription)}
              </Typography>
            ) : (
              <></>
            )}
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
            {event.maximumSpots ? (
              <Typography variant="body2" color={color} component="p">
                {remainingSpots}&nbsp;
                {t('places_left')}
              </Typography>
            ) : (
              <></>
            )}
            <Problems />
          </CardContent>
        </Paper>
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
