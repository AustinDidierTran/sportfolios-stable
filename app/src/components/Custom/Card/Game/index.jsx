import React from 'react';

import styles from './GameItem.module.css';

import { Typography, Card, TextField } from '../../../MUI';
import { useFormInput } from '../../../../hooks/forms';
import { useEffect } from 'react';

export default function GameItem(props) {
  const { teams, changeScore, gameIndex } = props;

  const theTeams = teams.map(team => {
    return { ...team, input: useFormInput(team.score) };
  });

  const saveScore = () => {
    theTeams.map((team, teamIndex) => {
      if (team.input.hasChanged) {
        team.input.setCurrentAsDefault();
        changeScore(gameIndex, teamIndex, team.input.value);
      }
    });
  };
  useEffect(() => saveScore(), [theTeams]);

  return (
    <Card className={styles.game}>
      {theTeams.map(team => (
        <div className={styles.team}>
          <Typography className={styles.name} variant="h6">
            {team.name}
          </Typography>
          <TextField
            className={styles.score}
            type="number"
            {...team.input.inputProps}
          />
        </div>
      ))}
    </Card>
  );
}
