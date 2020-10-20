import React from 'react';
import clsx from 'clsx';

import { Container, Typography, List } from '../../../components/MUI';

import { Paper } from '../../../components/Custom';

import styles from './Infos.module.css';
import { useTranslation } from 'react-i18next';

export default function Infos() {
  const { t } = useTranslation();

  const infos = {
    description:
      "Ce tournoi est le premier tournoi du circuit CQU7 de l'année",
    responsable: 'Austin-Didier Tran',
    email: 'didier@sportfolios.app',
    phone: '819-123-4567',
    informations: 'La tente de nourriture est situ',
    location: 'Parc Olympic',
    adress: '3791, Chemin Queen Mary',
    city: 'Montréal',
    nce: 'QC',
    postalCode: 'H3V 1A8',
    sections: [
      {
        title: 'Prix',
        text: 'Le prix du tournoi est de 280$ par équipe',
      },
      {
        title: 'Alignement recommandé',
        text: "L'Alignement recommandé est de 21 joueurs par équipe",
      },
      {
        title: 'Règlement du tournoi',
        text:
          'Le tournoi utiliseras la 11eme édition des règlements de la WFDF',
      },
      {
        title: 'Lorem Ipsum',
        text:
          'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?',
      },
    ],
  };

  return (
    <Container className={styles.container}>
      <Paper className={clsx(styles.card, styles.location)}>
        <Typography variant="h3" color="primary">
          Location
        </Typography>
        <Typography variant="h5">{infos.location}</Typography>
        <Typography variant="h5" color="textSecondary">
          {infos.adress}, <br /> {infos.city}, {infos.province}{' '}
          {infos.postalCode}
        </Typography>
      </Paper>
      <Paper className={clsx(styles.card, styles.responsable)}>
        <Typography variant="h3" color="primary">
          {t('event_manager')}
        </Typography>
        <Typography variant="h5">{infos.responsable}</Typography>
        <Typography variant="h5" color="textSecondary">
          {infos.email} <br />
          {infos.phone}
        </Typography>
      </Paper>
      <Paper className={clsx(styles.card, styles.description)}>
        <Typography variant="h3" color="primary">
          Description
        </Typography>
        <Typography variant="h5">{infos.description}</Typography>
      </Paper>
      <Paper className={clsx(styles.card, styles.infos)}>
        <Typography variant="h3" color="primary">
          {t('general_informations')}
        </Typography>
        <List>
          {infos.sections.map((section, index) => (
            <Container className={styles.section} key={index}>
              <Typography variant="h5" className={styles.title}>
                {section.title}:{' '}
              </Typography>
              <Typography
                variant="h5"
                color="textSecondary"
                className={styles.text}
              >
                {' '}
                {section.text}
              </Typography>
            </Container>
          ))}
        </List>
      </Paper>
    </Container>
  );
}
