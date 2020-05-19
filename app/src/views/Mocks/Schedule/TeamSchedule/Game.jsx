import React from 'react';

import { Card, Typography } from '../../../../components/MUI';
import styles from './TeamSchedule.module.css';

export default function Game(props) {
  const { game } = props;

  return game ? (
    <Card className={styles.game}>
      <div className={styles.infos}>
        <Typography
          className={styles.time}
          variant="h6"
          color="textSecondary"
        >
          {game.time}
        </Typography>
        <Typography
          className={styles.type}
          variant="h6"
          color="textSecondary"
        >
          {game.type}
        </Typography>
        <Typography
          className={styles.field}
          variant="h6"
          color="textSecondary"
        >
          {game.field}
        </Typography>
      </div>
      <hr />
      <div className={styles.scores}>
        <Typography className={styles.leftTeamScore} variant="h5">
          {game.leftTeamScore}
        </Typography>
        <Typography className={styles.rightTeamScore} variant="h5">
          {game.rightTeamScore}
        </Typography>
        <Typography className={styles.matchup} variant="h3">
          {game.matchup}
        </Typography>
      </div>
    </Card>
  ) : (
    <Card className={styles.game}>
      <Typography
        className={styles.matchup}
        variant="h6"
        color="secondary"
      >
        BAIL
      </Typography>
    </Card>
  );
}
