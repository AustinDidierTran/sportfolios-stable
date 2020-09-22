import React from 'react';

import { Typography } from '../../../components/MUI';
import styles from './Game.module.css';
import { Container } from '@material-ui/core';

export const GAME_TYPES = {
  GAME: 'game',
  BAIL: 'bail',
};

export default function Game(props) {
  const { game } = props;

  return game.type == GAME_TYPES.GAME ? (
    <Container className={styles.game}>
      <Typography
        className={styles.time}
        variant="h6"
        color="textSecondary"
      >
        {game.startTime}
      </Typography>
      <Typography className={styles.leftTeamScore} variant="h5">
        {game.leftTeamScore}
      </Typography>
      <Typography className={styles.leftTeam} variant="h3">
        {game.leftTeam}
      </Typography>
      <Typography className={styles.VS} variant="h3">
        VS
      </Typography>
      <Typography className={styles.rightTeam} variant="h3">
        {game.rightTeam}
      </Typography>
      <Typography className={styles.rightTeamScore} variant="h5">
        {game.rightTeamScore}
      </Typography>
      <Typography
        className={styles.field}
        variant="h6"
        color="textSecondary"
      >
        {game.field}
      </Typography>
    </Container>
  ) : (
    <Container className={styles.bail}>
      <Typography
        className={styles.time}
        variant="h6"
        color="textSecondary"
      >
        {game.startTime}
      </Typography>
      <Typography
        className={styles.bailtxt}
        variant="h6"
        color="secondary"
      >
        BAIL
      </Typography>
    </Container>
  );
}
