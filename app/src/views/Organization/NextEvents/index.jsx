import React from 'react';

import { goTo, ROUTES } from '../../../actions/goTo';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import styles from './NextEvents.module.css';
import Register from './Register';
import Results from './Results';
import Schedule from './Schedule';
import { Avatar } from '../../../components/Custom';
import {
  Typography,
  Card,
  ListItem,
  ListItemIcon,
  Container,
} from '../../../components/MUI';
import { List } from '../../../components/Custom';
import history from '../../../stores/history';

export const EVENT_STATUS_ENUM = {
  COMPLETED: 'completed',
  ONGOING: 'ongoing',
  REGISTRATION: 'registration',
};

export default function NextEvents(props) {
  const { t } = useTranslation();

  const events = [
    {
      name: 'Primavera',
      initial: 'P',
      date: '5 Mai',
      circuit: 'CQU5',
      place: '3791, Chemin Queen Mary, Montréal, QC H3V 1A8',
      type: EVENT_STATUS_ENUM.COMPLETED,
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    },
    {
      name: 'FrisbeeFest',
      initial: 'FF',
      date: '30 Mai',
      circuit: 'CQU7',
      place: 'Trois-Rivières',
      type: EVENT_STATUS_ENUM.ONGOING,
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    },
    {
      name: 'Jazz',
      initial: 'JZ',
      date: '30 Juin',
      circuit: 'CQU7',
      place: 'Montréal',
      type: EVENT_STATUS_ENUM.REGISTRATION,
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    },
  ];

  return (
    <Card className={styles.card} gutterBottom>
      <Typography className={styles.title} variant="h3">
        {t('upcoming_events')}
      </Typography>
      <List
        items={events}
        rowRenderer={event => (
          <ListItem button onClick={() => history.push('/event')}>
            <Container className={styles.event}>
              <ListItemIcon>
                <Avatar
                  initials={event.initial}
                  size="md"
                  className={styles.avatar}
                />
              </ListItemIcon>
              <Container className={styles.infos}>
                <Container className={styles.tournoi}>
                  <Typography className={styles.name} variant="h3">
                    {event.name}
                  </Typography>
                  <Typography className={styles.circuit} variant="h5">
                    {event.circuit}
                  </Typography>
                </Container>
                <hr />
                <Container className={styles.dateregister}>
                  <Typography className={styles.date} variant="h5">
                    {event.date}
                  </Typography>
                  {event.type === EVENT_STATUS_ENUM.REGISTRATION ? (
                    <Register />
                  ) : event.type === EVENT_STATUS_ENUM.ONGOING ? (
                    <Schedule />
                  ) : event.type === EVENT_STATUS_ENUM.COMPLETED ? (
                    <Results />
                  ) : (
                    <></>
                  )}
                </Container>
              </Container>
            </Container>
          </ListItem>
        )}
      />
      {/* {events.map(event => (
          <ListItem button onClick={() => history.push('/event')}>
            <Container className={styles.event}>
              <ListItemIcon>
                <Avatar
                  initials={event.initial}
                  size="md"
                  className={styles.avatar}
                />
              </ListItemIcon>
              <Container className={styles.infos}>
                <Container className={styles.tournoi}>
                  <Typography className={styles.name} variant="h3">
                    {event.name}
                  </Typography>
                  <Typography className={styles.circuit} variant="h5">
                    {event.circuit}
                  </Typography>
                </Container>
                <hr />
                <Container className={styles.dateregister}>
                  <Typography className={styles.date} variant="h5">
                    {event.date}
                  </Typography>
                  {event.type === EVENT_STATUS_ENUM.REGISTRATION ? (
                    <Register />
                  ) : event.type === EVENT_STATUS_ENUM.ONGOING ? (
                    <Schedule />
                  ) : eventtype === EVENT_STATUS_ENUM.COMPLETED ? (
                    <Results />
                  ) : (
                    <></>
                  )}
                </Container>
              </Container>
            </Container>
          </ListItem>
        ))} */}
    </Card>
  );
}
