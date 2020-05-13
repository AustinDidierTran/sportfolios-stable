import React, { useState } from 'react';

import { useTranslation } from 'react-i18next';
import styles from './AthleteHistory.module.css';
import {
  TextField,
  Card,
  List,
  ListItem,
} from '../../../../../components/MUI';

import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import CardHeader from '@material-ui/core/CardHeader';

export default function AthleteHistory(props) {
  const { t } = useTranslation();

  const [privacy, setPrivacy] = useState('public');

  const handleChange = event => {
    setPrivacy(event.target.value);
  };

  return (
    <Card className={styles.card}>
      <CardHeader title={t('athlete_history')} />
      <List>
        <ListItem>
          <TextField
            disabled
            namespace="AthleteHistory"
            value={'1st Place C4UC Louis Luncheonette 2019'}
            className={styles.textField}
          />
          <Select
            className={styles.select}
            labelId="public-or-private"
            id="public-or-private"
            value={privacy}
            onChange={handleChange}
          >
            <MenuItem value={'public'}>{'public'}</MenuItem>
            <MenuItem value={'private'}>{t('private')}</MenuItem>
          </Select>
        </ListItem>
      </List>
    </Card>
  );
}
