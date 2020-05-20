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

  return (
    <Card>
      <Container className={styles.responsable}>
        <Typography variant="h3">Description</Typography>
        <Typography variant="h5" color="textSecondary">
          Ce tournoi est le premier tournoi du circuit CQU7 de l'année
        </Typography>
      </Container>
      <Container className={styles.responsable}>
        <Typography variant="h3">
          Responsable de l'événement
        </Typography>
        <Typography variant="h5" color="textSecondary">
          Austin-Didier Tran
        </Typography>
      </Container>
      <Container className={styles.infos}>
        <Typography variant="h3">Informations Générales</Typography>
        <Typography variant="h5" color="textSecondary">
          Bouffe...
        </Typography>
      </Container>
      <Container className={styles.infos}>
        <Typography variant="h3">Lieu</Typography>
        <Typography variant="h5" color="textSecondary">
          3791, Chemin Queen Mary, Montréal, QC H3V 1A8
        </Typography>
      </Container>
    </Card>
  );
}
