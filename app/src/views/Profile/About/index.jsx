import React from 'react';

import { useTranslation } from 'react-i18next';
import styles from './About.module.css';
import {
  Card,
  Typography,
  Container,
  List,
  ListItem,
} from '../../../components/MUI';

export default function About(props) {
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
      <Card className={styles.description}>
        <Typography
          variant="h4"
          color="primary"
          className={styles.title}
        >
          {description.title}
        </Typography>
        <Container className={styles.container}>
          <Typography variant="h6">{description.text}</Typography>
        </Container>
      </Card>
      <Card className={styles.team}>
        <Typography
          variant="h4"
          color="primary"
          className={styles.title}
        >
          {team.title}
        </Typography>
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
      </Card>
      <Card className={styles.contact}>
        <Typography
          variant="h4"
          color="primary"
          className={styles.title}
        >
          {contact.title}
        </Typography>
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
      </Card>
    </Container>
  );
}
