import React from 'react';

import styles from './Team.module.css';

import { Typography, TextField } from '../../../../MUI';

export default function Team(props) {
  const { team, getRank } = props;

  return (
    <div className={styles.team}>
      <Typography
        className={styles.position}
        color="textSecondary"
        variant="h7"
      >
        {getRank(team.id)}
      </Typography>
      <Typography className={styles.name} variant="h6">
        {team.name}
      </Typography>
      <TextField
        className={styles.score}
        type="number"
        {...team.input.inputProps}
      />
    </div>
  );
}
