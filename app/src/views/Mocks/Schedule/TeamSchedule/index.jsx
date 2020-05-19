import React, { useState } from 'react';

import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';

import {
  Card,
  Typography,
  Container,
} from '../../../../components/MUI';

import styles from './TeamSchedule.module.css';
import { useTranslation } from 'react-i18next';

export default function TeamSchedule(props) {
  const { t } = useTranslation();

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
      <Card className={styles.game}>
        <div className={styles.infos}>
          <Typography
            className={styles.time}
            variant="h6"
            color="textSecondary"
          >
            8:35 - 9:45
          </Typography>
          <Typography
            className={styles.type}
            variant="h6"
            color="textSecondary"
          >
            Pool Play
          </Typography>
          <Typography
            className={styles.field}
            variant="h6"
            color="textSecondary"
          >
            Field 4
          </Typography>
        </div>
        <hr />
        <div className={styles.scores}>
          <Typography className={styles.leftTeamScore} variant="h5">
            8
          </Typography>
          <Typography className={styles.rightTeamScore} variant="h5">
            11
          </Typography>
          <Typography className={styles.matchup} variant="h3">
            Manic vs SGC
          </Typography>
        </div>
      </Card>
      <Card className={styles.game}>
        <Typography
          className={styles.matchup}
          variant="h6"
          color="secondary"
        >
          BAIL
        </Typography>
      </Card>
      <Card className={styles.game}>
        <div className={styles.infos}>
          <Typography
            className={styles.time}
            variant="h6"
            color="textSecondary"
          >
            10:50 - 12:00
          </Typography>
          <Typography
            className={styles.type}
            variant="h6"
            color="textSecondary"
          >
            Bracket 1-8
          </Typography>
          <Typography
            className={styles.field}
            variant="h6"
            color="textSecondary"
          >
            Field 6
          </Typography>
        </div>
        <hr />
        <div className={styles.scores}>
          <Typography className={styles.leftTeamScore} variant="h5">
            13
          </Typography>
          <Typography className={styles.rightTeamScore} variant="h5">
            9
          </Typography>
          <Typography className={styles.matchup} variant="h3">
            Manic vs Quake
          </Typography>
        </div>
      </Card>
    </Container>
  );
}
