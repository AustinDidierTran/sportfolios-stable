import React, { useState } from 'react';

import {
  Card,
  List,
  ListItem,
  Typography,
  Container,
} from '../../../../components/MUI';
import { Avatar } from '../../../../components/Custom';
import styles from './Roster.module.css';
import { useTranslation } from 'react-i18next';

export default function Roster(props) {
  const { t } = useTranslation();

  const categories = [
    {
      name: t('players'),
      persons: [
        {
          name: 'Julien Bernat',
          number: 10,
        },
        {
          name: 'Renaud Drouin',
          number: 22,
        },
        {
          name: 'Alexandre Lafleur',
          number: 14,
        },
      ],
    },
    {
      name: 'Coaches',
      persons: [
        {
          name: 'Austin-Didier Tran',
          number: 28,
        },
      ],
    },
  ];

  categories.map(categorie =>
    categorie.persons.sort((a, b) => a.number - b.number),
  );

  return (
    <Card className={styles.bigCard}>
      <Typography variant="h3" className={styles.title}>
        {' '}
        {t('roster')}{' '}
      </Typography>
      <hr className={styles.divider}></hr>
      {categories.map(categorie => (
        <Container className={styles.container}>
          <Typography variant="h4" className={styles.subtitle}>
            {categorie.name}
          </Typography>
          {categorie.persons.map(person => (
            <List className={styles.list}>
              <ListItem className={styles.listItem}>
                <Typography
                  color="primary"
                  variant="h5"
                  className={styles.number}
                >
                  {person.number}
                </Typography>
                <Typography variant="h6" className={styles.name}>
                  {person.name}
                </Typography>
                <hr className={styles.divider}></hr>
              </ListItem>
            </List>
          ))}
        </Container>
      ))}
    </Card>
  );
}
