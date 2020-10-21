import React from 'react';

import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';

import Game from './Game';

import { Typography, Container } from '../../../../components/MUI';
import { Paper } from '../../../../components/MUI';

import styles from './Schedule.module.css';
import { useTranslation } from 'react-i18next';

export default function TeamSchedule() {
  const { t } = useTranslation();

  const poolPlay = {
    games: [
      {
        startTime: '8:00',
        endTime: '9:10',
        field: 'Field 4',
        type: 'game',
        leftTeamScore: 12,
        rightTeamScore: 16,
        leftTeam: 'SGC',
        rightTeam: 'Manic',
      },
      { startTime: '9:10', endTime: '10:40', type: 'bail' },
      {
        startTime: '10:40',
        endTime: '11:50',
        field: 'Field 4',
        type: 'game',
        leftTeamScore: 13,
        rightTeamScore: 14,
        leftTeam: 'Manic',
        rightTeam: 'Quake',
      },
      {
        startTime: '12:00',
        endTime: '13:10',
        field: 'Field 6',
        type: 'game',
        leftTeamScore: 10,
        rightTeamScore: 12,
        leftTeam: 'Manic',
        rightTeam: 'Magma',
      },
      { startTime: '13:10', endTime: '14:40', type: 'bail' },
    ],
    name: 'Pool A',
  };

  const crossOver = {
    games: [
      {
        startTime: '14:40',
        endTime: '15:50',
        field: 'Field 5',
        type: 'game',
        leftTeamScore: null,
        rightTeamScore: null,
        leftTeam: 'Manic',
        rightTeam: 'Inferno',
      },
    ],
    name: 'Crossover 1-8',
  };

  const brackets = {
    games: [
      {
        startTime: '8:00',
        endTime: '9:10',
        field: 'Field 4',
        type: 'game',
        leftTeamScore: null,
        rightTeamScore: null,
        leftTeam: 'SGC',
        rightTeam: 'Manic',
      },
      { startTime: '9:10', endTime: '10:40', type: 'bail' },
      {
        startTime: '10:40',
        endTime: '11:50',
        field: 'Field 4',
        type: 'game',
        leftTeamScore: null,
        rightTeamScore: null,
        leftTeam: 'Manic',
        rightTeam: 'Quake',
      },
      {
        startTime: '12:00',
        endTime: '13:10',
        field: 'Field 6',
        type: 'game',
        leftTeamScore: null,
        rightTeamScore: null,
        leftTeam: 'Manic',
        rightTeam: 'Magma',
      },
    ],
    name: 'Bracket 1-8',
  };

  const phases = [poolPlay, crossOver, brackets];

  return (
    <Container className={styles.container}>
      <FormControl className={styles.select}>
        <InputLabel>{t('team')}</InputLabel>
        <Select>
          <MenuItem value={'All Teams'}>All Teams</MenuItem>
          <MenuItem value={'Manic'}>Manic</MenuItem>
          <MenuItem value={'SGC'}>SGC</MenuItem>
          <MenuItem value={'Quake'}>Quake</MenuItem>
        </Select>
      </FormControl>
      <FormControl className={styles.select}>
        <InputLabel>Type of phase</InputLabel>
        <Select>
          <MenuItem value={'All Phase'}>All Phase</MenuItem>
          <MenuItem value={'PoolPlay'}>PoolPlay</MenuItem>
          <MenuItem value={'CrossOver'}>CrossOver</MenuItem>
          <MenuItem value={'Brackets'}>Brackets</MenuItem>
        </Select>
      </FormControl>
      {phases.map((phase, index) => (
        <Paper className={styles.phase}>
          <Typography
            variant="h6"
            color="textSecondary"
            className={styles.name}
            key={index}
          >
            {phase.name}
          </Typography>
          <hr className={styles.divider}></hr>
          {phase.games.map((g, index) => (
            <Game game={g} key={index} />
          ))}
        </Paper>
      ))}
    </Container>
  );
}
