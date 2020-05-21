import React, { useState } from 'react';

import {
  Container,
  Typography,
  Button,
  Card,
} from '../../../../components/MUI';

import styles from './Infos.module.css';
import { useTranslation } from 'react-i18next';

export default function Infos(props) {
  const { t } = useTranslation();

  const infos = {
    description:
      "Ce tournoi est le premier tournoi du circuit CQU7 de l'année",
    responsable: 'Austin-Didier Tran',
    email: 'didier@sportfolios.app',
    phone: '819-123-4567',
    informations: 'La tente de nourriture est situ',
    lieu: 'Parc Olympic',
    adress: '3791, Chemin Queen Mary',
    city: 'Montréal',
    province: 'QC',
    postalCode: 'H3V 1A8',
    sections: [
      {
        title: 'Prix',
        texte: 'Le prix du tournoi est de 280$ par équipe',
      },
      {
        title: 'Alignement recommandé',
        texte: '21 joueurs par équipe',
      },
      {
        title: 'Règlement du tournoi',
        texte:
          'Le tournoi utiliseras la 11eme édition des règlements de la WFDF',
      },
    ],
  };

  return (
    <Card className={styles.card}>
      <Container className={styles.lieu}>
        <Typography variant="h3" color="primary">
          Location
        </Typography>
        <Typography variant="h5">{infos.lieu}</Typography>
        <Typography variant="h5" color="textSecondary">
          {infos.adress}, <br /> {infos.city}, {infos.province}{' '}
          {infos.postalCode}
        </Typography>
      </Container>
      <Container className={styles.description}>
        <Typography variant="h3" color="primary">
          Description
        </Typography>
        <Typography variant="h5" color="textSecondary">
          {infos.description}
        </Typography>
      </Container>
      <Container className={styles.responsable}>
        <Typography variant="h3" color="primary">
          {t('event_manager')}
        </Typography>
        <Typography variant="h5">{infos.responsable}</Typography>
        <Typography variant="h5" color="textSecondary">
          {infos.email}
          <br />
          {infos.phone}
        </Typography>
      </Container>
      <Container className={styles.infos}>
        <Typography variant="h3" color="primary">
          {t('general_informations')}
        </Typography>
        {infos.sections.map(section => (
          <Container>
            <Typography variant="h5">{section.title}:</Typography>
            <Typography variant="h5" color="textSecondary">
              {section.texte}
            </Typography>
            <hr />
          </Container>
        ))}
      </Container>
    </Card>
  );
}
