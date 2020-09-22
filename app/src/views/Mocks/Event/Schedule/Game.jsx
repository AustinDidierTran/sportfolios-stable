import React, { useMemo } from 'react';

import { Typography } from '../../../../components/MUI';
import styles from './Game.module.css';
import { Container } from '@material-ui/core';

export default function Game(props) {
  const { game } = props;

  const MIN_WIDTH = 768;

  const time = useMemo(
    () =>
      game
        ? window.innerWidth < MIN_WIDTH
          ? game.startTime
          : `${game.startTime} - ${game.endTime}`
        : null,
    [window.innerWidth],
  );

  return game.type == 'game' ? (
    <Container className={styles.game}>
      <Typography
        className={styles.time}
        variant="h6"
        color="textSecondary"
      >
        {time}
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
        {time}
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
