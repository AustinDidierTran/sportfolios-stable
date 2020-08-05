import React, { useEffect } from 'react';

import styles from './GameItem.module.css';

import { Typography, Card, TextField } from '../../../MUI';
import { useFormInput } from '../../../../hooks/forms';

export default function GameItem(props) {
  const { id, teams, changeScore } = props;

  const rightTeamScore = useFormInput(teams[0].score);
  const leftTeamScore = useFormInput(teams[1].score);

  const onChange = () => {
    changeScore(leftTeamScore.value, rightTeamScore.value, id);
  };

  useEffect(() => onChange(), [
    leftTeamScore.value,
    rightTeamScore.value,
  ]);

  return (
    <Card className={styles.game}>
      <TextField
        className={styles.leftTeamScore}
        type="number"
        {...leftTeamScore.inputProps}
      />
      <Typography className={styles.leftTeam} variant="h6">
        {teams[0].name}
      </Typography>
      <Typography className={styles.VS} variant="h6">
        VS
      </Typography>
      <Typography className={styles.rightTeam} variant="h6">
        {teams[1].name}
      </Typography>
      <TextField
        className={styles.rightTeamScore}
        type="number"
        {...rightTeamScore.inputProps}
      />
    </Card>
  );
}
