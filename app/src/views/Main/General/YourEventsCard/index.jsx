import React from 'react';

import { useTranslation } from 'react-i18next';
import styles from './YourEventsCard.module.css';
import Register from '../../../Entity/NextEvents/Register';
import Results from '../../../Entity/NextEvents/Results';
import Schedule from '../../../Entity/NextEvents/Schedule';
import { Avatar, Paper } from '../../../../components/Custom';
import {
  Typography,
  ListItem,
  ListItemIcon,
  Container,
} from '../../../../components/MUI';
import { List } from '../../../../components/Custom';
import history from '../../../../stores/history';
import { EVENT_STATUS_ENUM } from '../../../Entity/NextEvents';

export default function YourEventsCard(props) {
  const { t } = useTranslation();

  const { events } = props;

  return (
    <Paper className={styles.card} title={t('your_upcoming_events')}>
      <List
        items={events}
        rowRenderer={(event, index) => (
          <ListItem
            button
            onClick={() => history.push('/event')}
            key={index}
          >
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
                  <Typography className={styles.name} variant="h5">
                    {event.name}
                  </Typography>
                  <Typography className={styles.circuit} variant="h6">
                    {event.circuit}
                  </Typography>
                </Container>
                <hr />
                <Container className={styles.dateregister}>
                  <Typography className={styles.date} variant="h6">
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
    </Paper>
  );
}
