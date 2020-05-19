import React, { useState } from 'react';

import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';

import {
  Card,
  Container,
  Typography,
  Button,
} from '../../../../components/MUI';

import styles from './TeamSchedule.module.css';
import { useTranslation } from 'react-i18next';

export default function TeamSchedule(props) {
  const { t } = useTranslation();

  return (
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
  );
}
