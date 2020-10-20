import React from 'react';

import {
  List,
  ListItem,
  Typography,
  Container,
} from '../../../components/MUI';
import { Avatar, Paper } from '../../../components/Custom';
import styles from './Ranking.module.css';
import { useTranslation } from 'react-i18next';

export default function Ranking() {
  const { t } = useTranslation();

  const categories = [
    {
      name: 'Élite',
      teams: [
        {
          name: "Sherbrooke Gentlemen's Club",
          initials: 'SGC',
          photoUrl: null,
          position: 3,
        },
        { name: 'Manic', initials: 'M', photoUrl: null, position: 2 },
        {
          name: 'Quake',
          initials: 'Qk',
          photoUrl: null,
          position: 1,
        },
      ],
    },
    {
      name: 'Compétitif',
      teams: [
        {
          name: 'Magma',
          initials: 'Mg',
          photoUrl: null,
          position: 3,
        },
        {
          name: 'Inferno',
          initials: 'If',
          photoUrl: null,
          position: 2,
        },
        {
          name: 'Mesa',
          initials: 'Ms',
          photoUrl: null,
          position: 1,
        },
      ],
    },
  ];

  categories.map(categorie =>
    categorie.teams.sort((a, b) => a.position - b.position),
  );
  return (
    <Paper className={styles.bigCard}>
      <Typography variant="h3" className={styles.title}>
        {t('preranking')}
      </Typography>
      <hr className={styles.divider}></hr>
      {categories.map((categorie, index) => (
        <Container className={styles.container} key={index}>
          <Typography variant="h4">{categorie.name}</Typography>
          {categorie.teams.map((team, teamIndex) => (
            <List className={styles.list} key={teamIndex}>
              <ListItem className={styles.listItem}>
                <Typography
                  color="primary"
                  variant="h5"
                  className={styles.position}
                >
                  {team.position}
                </Typography>
                <Avatar
                  className={styles.avatar}
                  initials={team.initials}
                  photoUrl={team.photoUrl}
                  size="sm"
                />
                <Typography variant="h5" className={styles.name}>
                  {team.name}
                </Typography>
                <hr className={styles.divider}></hr>
              </ListItem>
            </List>
          ))}
        </Container>
      ))}
    </Paper>
  );
}
