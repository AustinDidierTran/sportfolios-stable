import React from 'react';

import { Table } from '../../../components/Custom';

import { Card, CardContent } from '../../../components/MUI';
import styles from './Admin.module.css';
import { useTranslation } from 'react-i18next';

export default function Ranking(props) {
  const { t } = useTranslation();

  const teams = [
    {
      name: 'Sherbrooke Gentlemens Club',
      captain: 'Vincent Sasseville',
      rosterIsValid: 'Alignement conforme',
      paymentDue: 0,
    },
    {
      name: 'Manic',
      captain: 'Elliot Heloir',
      rosterIsValid: 'Alignement conforme',
      paymentDue: 0,
    },
    {
      name: 'Magma',
      captain: 'Cedric Aubut-Boucher',
      rosterIsValid: 'Alignement conforme',
      paymentDue: 0,
    },
    {
      name: 'Mesa',
      captain: 'Christian Painchaud',
      rosterIsValid: 'Alignement non-conforme',
      paymentDue: 0,
    },
    {
      name: 'Quake',
      captain: 'Francis Vallée',
      rosterIsValid: 'Alignement conforme',
      paymentDue: 0,
    },
    {
      name: 'Quartz',
      captain: 'Joseph Genest',
      rosterIsValid: 'Alignement conforme',
      paymentDue: 0,
    },
  ];

  return (
    <Card className={styles.bigCard}>
      <CardContent>
        <Table
          title={t('registration_status')}
          headers={[
            {
              display: "Nom de l'équipe",
              type: 'text',
              value: 'name',
            },
            {
              display: 'Nom du capitaine',
              type: 'text',
              value: 'captain',
            },
            {
              display: "Conformité de l'alignement",
              type: 'text',
              value: 'rosterIsValid',
            },
            {
              display: 'Solde a payer',
              type: 'text',
              value: 'paymentDue',
            },
          ]}
          data={teams}
          description={
            "Nombres d'équipes inscrites: 6 sur 16 places disponibles"
          }
        ></Table>
      </CardContent>
    </Card>
  );
}
