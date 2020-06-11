import React from 'react';

import { useTranslation } from 'react-i18next';
import styles from './About.module.css';
import {
  Typography,
  Container,
  List,
  ListItem,
} from '../../../components/MUI';
import { Paper } from '../../../components/Custom';

export default function About() {
  const { t } = useTranslation();

  const description = {
    title: 'Description',
    text:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  };

  const team = {
    title: t('our_team'),
    content: [
      {
        name: 'Directeur général',
        text: 'Guillaume Proulx Goulet',
      },
      {
        name: 'Coordonnateur technique',
        text: 'Malik Auger-Semmar',
      },
      {
        name: 'Coordonnateur aux opérations',
        text: 'Dave Brideau',
      },
    ],
  };

  const contact = {
    title: t('contact_us'),
    content: [
      {
        name: t('phone_number'),
        text: '(514) 252-3159',
      },
      {
        name: t('email'),
        text: 'info@fqu.ca',
      },
    ],
  };

  return (
    <Container className={styles.main}>
      <Paper className={styles.description} title={description.title}>
        <Container className={styles.container}>
          <Typography variant="h6">{description.text}</Typography>
        </Container>
      </Paper>
      <Paper className={styles.team} title={team.title}>
        <List>
          {team.content.map(text => (
            <ListItem className={styles.listItem}>
              <Container className={styles.container}>
                <Typography
                  color="textSecondary"
                  variant="h6"
                  noWrap
                  className={styles.name}
                >
                  {text.name}:
                </Typography>
                <Typography
                  variant="h6"
                  noWrap
                  className={styles.text}
                >
                  &nbsp;
                  {text.text}
                </Typography>
              </Container>
            </ListItem>
          ))}
        </List>
      </Paper>
      <Paper className={styles.contact} title={contact.title}>
        <List>
          {contact.content.map(text => (
            <ListItem className={styles.listItem}>
              <Container className={styles.container}>
                <Typography
                  color="textSecondary"
                  variant="h6"
                  className={styles.name}
                >
                  {text.name}:
                </Typography>
                <Typography variant="h6" className={styles.text}>
                  &nbsp;
                  {text.text}
                </Typography>
              </Container>
            </ListItem>
          ))}
        </List>
      </Paper>
    </Container>
  );
}
