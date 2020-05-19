import React, { useState } from 'react';

import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';

import Game from './Game';

import {
  Card,
  Typography,
  Container,
} from '../../../../components/MUI';

import styles from './TeamSchedule.module.css';
import { useTranslation } from 'react-i18next';

export default function TeamSchedule(props) {
  const { t } = useTranslation();

  const games = [
    {
      time: '8:35 - 9:45',
      field: 'Field 4',
      type: 'Pool Play',
      leftTeamScore: 8,
      rightTeamScore: 11,
      matchup: 'SGC VS Manic',
    },
    null,
    {
      time: '10:50 - 12:00',
      field: 'Field 4',
      type: 'Pool Play',
      leftTeamScore: 12,
      rightTeamScore: 16,
      matchup: 'Manic VS Quake',
    },
  ];

  return (
    <Container className={styles.container}>
      <Card className={styles.card}>
        <FormControl className={styles.select}>
          <InputLabel>{t('team')}</InputLabel>
          <Select>
            <MenuItem value="" disabled>
              {t('team')}
            </MenuItem>
            <MenuItem value={'Manic'}>Manic</MenuItem>
            <MenuItem value={'SGC'}>SGC</MenuItem>
            <MenuItem value={'Quake'}>Quake</MenuItem>
          </Select>
        </FormControl>
      </Card>
      {games.map(g => (
        <Game game={g} />
      ))}
    </Container>
  );
}
