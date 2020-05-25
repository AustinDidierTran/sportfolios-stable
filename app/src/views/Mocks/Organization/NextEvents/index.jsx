import React from 'react';

import { goTo, ROUTES } from '../../../../actions/goTo';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import styles from './NextEvents.module.css';
import Register from './Register';
import Results from './Results';
import Schedule from './Schedule';
import { Avatar } from '../../../../components/Custom';
import {
  Typography,
  Card,
  List,
  ListItem,
  ListItemIcon,
  IconButton,
  Container,
  Divider,
} from '../../../../components/MUI';
<<<<<<< Updated upstream

import { TABS_ENUM } from '../../Event';
=======
import { Divider } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CardContent from '@material-ui/core/CardContent';
import Collapse from '@material-ui/core/Collapse';
import clsx from 'clsx';
>>>>>>> Stashed changes

export default function NextEvents(props) {
  const { t } = useTranslation();

  const events = [
    {
      name: 'Primavera',
      initial: 'P',
      date: '5 Mai',
      circuit: 'CQU5',
      place: '3791, Chemin Queen Mary, Montréal, QC H3V 1A8',
      type: 'past',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    },
    {
      name: 'FrisbeeFest',
      initial: 'FF',
      date: '30 Mai',
      circuit: 'CQU7',
      place: 'Trois-Rivières',
      type: 'soon',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    },
    {
      name: 'Jazz',
      initial: 'JZ',
      date: '30 Juin',
      circuit: 'CQU7',
      place: 'Montréal',
      type: 'longTime',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    },
  ];

  return (
    <Card className={styles.card} gutterBottom>
      <Typography className={styles.title} variant="h3">
        {t('upcoming_events')}
      </Typography>
      <List>
        {events.map(event => (
          <ListItem
            button
            onClick={() =>
              goTo(ROUTES.mockEvent, { openTab: TABS_ENUM.REGISTER })
            }
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
                  {event.type == 'longTime' ? (
                    <Register />
                  ) : event.type == 'soon' ? (
                    <Schedule />
                  ) : (
                    <Results />
                  )}
                </Container>
              </Container>
            </Container>
<<<<<<< Updated upstream
          </ListItem>
        ))}
=======
            <IconButton
              className={clsx(styles.expand, {
                [styles.expandOpen]: expanded,
              })}
              onClick={handleExpandClick}
              aria-expanded={expanded}
              label="show more"
            >
              <ExpandMoreIcon />
            </IconButton>
            <Collapse
              in={expanded}
              timeout="auto"
              unmountOnExit
              className={styles.description}
            >
              <CardContent>
                <Divider />
                <Typography className={styles.place} variant="h6">
                  3791, Chemin Queen Mary, Montréal, QC H3V 1A8
                </Typography>
                <br />
                <Typography
                  paragraph
                  variant="h6"
                  color="textSecondary"
                >
                  Lorem ipsum dolor sit amet, consectetur adipiscing
                  elit, sed do eiusmod tempor incididunt ut labore et
                  dolore magna aliqua. Ut enim ad minim veniam, quis
                  nostrud exercitation ullamco laboris nisi ut aliquip
                  ex ea commodo consequat. Duis aute irure dolor in
                  reprehenderit in voluptate velit esse cillum dolore
                  eu fugiat nulla pariatur. Excepteur sint occaecat
                  cupidatat non proident, sunt in culpa qui officia
                  deserunt mollit anim id est laborum.
                </Typography>
              </CardContent>
            </Collapse>
          </Container>
        </ListItem>
        <ListItem>
          <Container className={styles.event}>
            <ListItemIcon>
              <Avatar
                initials={'FF'}
                size="md"
                className={styles.avatar}
              />
            </ListItemIcon>
            <Container className={styles.infos}>
              <Container className={styles.tournoi}>
                <Typography className={styles.name} variant="h3">
                  FrisbeeFest
                </Typography>
                <Typography className={styles.circuit} variant="h5">
                  CQU7
                </Typography>
              </Container>
              <hr />
              <Container className={styles.dateregister}>
                <Typography className={styles.date} variant="h5">
                  30 Mai
                </Typography>
                <Register className={styles.register} />
              </Container>
            </Container>
            <IconButton
              className={clsx(styles.expand, {
                [styles.expandOpen]: expanded,
              })}
              onClick={handleExpandClick}
              aria-expanded={expanded}
              label="show more"
            >
              <ExpandMoreIcon />
            </IconButton>
            <Collapse
              in={expanded}
              timeout="auto"
              unmountOnExit
              className={styles.description}
            >
              <CardContent>
                <Divider />
                <Typography className={styles.place} variant="h6">
                  Trois-Rivière
                </Typography>
                <br />
                <Typography
                  paragraph
                  variant="h6"
                  color="textSecondary"
                >
                  Lorem ipsum dolor sit amet, consectetur adipiscing
                  elit, sed do eiusmod tempor incididunt ut labore et
                  dolore magna aliqua. Ut enim ad minim veniam, quis
                  nostrud exercitation ullamco laboris nisi ut aliquip
                  ex ea commodo consequat. Duis aute irure dolor in
                  reprehenderit in voluptate velit esse cillum dolore
                  eu fugiat nulla pariatur. Excepteur sint occaecat
                  cupidatat non proident, sunt in culpa qui officia
                  deserunt mollit anim id est laborum.
                </Typography>
              </CardContent>
            </Collapse>
          </Container>
        </ListItem>
        <ListItem>
          <Container className={styles.event}>
            <ListItemIcon>
              <Avatar
                initials={'Jz'}
                size="md"
                className={styles.avatar}
              />
            </ListItemIcon>
            <Container className={styles.infos}>
              <Container className={styles.tournoi}>
                <Typography className={styles.name} variant="h3">
                  Jazz
                </Typography>
                <Typography className={styles.circuit} variant="h5">
                  CQU7
                </Typography>
              </Container>
              <hr />
              <Container className={styles.dateregister}>
                <Typography className={styles.date} variant="h5">
                  20 Juin
                </Typography>
                <Register className={styles.register} />
              </Container>
            </Container>
            <IconButton
              className={clsx(styles.expand, {
                [styles.expandOpen]: expanded,
              })}
              onClick={handleExpandClick}
              aria-expanded={expanded}
              label="show more"
            >
              <ExpandMoreIcon />
            </IconButton>
            <Collapse
              in={expanded}
              timeout="auto"
              unmountOnExit
              className={styles.description}
            >
              <CardContent>
                <Divider />
                <Typography className={styles.place} variant="h6">
                  Complexe Sport Absolu, St-Jean-sur-Richelieu{' '}
                </Typography>
                <br />
                <Typography
                  paragraph
                  variant="h6"
                  color="textSecondary"
                >
                  Lorem ipsum dolor sit amet, consectetur adipiscing
                  elit, sed do eiusmod tempor incididunt ut labore et
                  dolore magna aliqua. Ut enim ad minim veniam, quis
                  nostrud exercitation ullamco laboris nisi ut aliquip
                  ex ea commodo consequat. Duis aute irure dolor in
                  reprehenderit in voluptate velit esse cillum dolore
                  eu fugiat nulla pariatur. Excepteur sint occaecat
                  cupidatat non proident, sunt in culpa qui officia
                  deserunt mollit anim id est laborum.
                </Typography>
              </CardContent>
            </Collapse>
          </Container>
        </ListItem>
>>>>>>> Stashed changes
      </List>
    </Card>
  );
}
