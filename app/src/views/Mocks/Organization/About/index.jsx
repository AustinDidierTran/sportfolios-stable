import React from 'react';

import { useTranslation } from 'react-i18next';
import styles from './About.module.css';
import { Card } from '../../../../components/MUI';
import { Typography, Container } from '@material-ui/core';

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
        text: 'Malik Auger-Semmar Goulet',
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
    <Card className={styles.card}>
      <Container className={styles.description}>
        <Typography variant="h3" color="primary">
          {description.title}
        </Typography>
        <Typography variant="h5">{description.text}</Typography>
        <hr />
      </Container>
      <Container className={styles.team}>
        <Typography
          variant="h3"
          color="primary"
          className={styles.title}
        >
          {team.title}
        </Typography>
        {team.content.map(text => (
          <Container className={styles.container}>
            <Typography variant="h5" className={styles.name}>
              {text.name}:
            </Typography>
            <Typography
              variant="h5"
              color="textSecondary"
              className={styles.text}
            >
              {text.text}
            </Typography>
          </Container>
        ))}
        <hr />
      </Container>
      <Container className={styles.contact}>
        <Typography
          variant="h3"
          color="primary"
          className={styles.title}
        >
          {contact.title}
        </Typography>
        {contact.content.map(text => (
          <Container className={styles.container}>
            <Typography variant="h5" className={styles.name}>
              {text.name}:
            </Typography>
            <Typography
              variant="h5"
              color="textSecondary"
              className={styles.text}
            >
              {text.text}
            </Typography>
          </Container>
        ))}
      </Container>
    </Card>
  );
}
