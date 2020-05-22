import React, { useState } from 'react';

import { useTranslation } from 'react-i18next';
import styles from './AthleteHistory.module.css';
import { Card, List, ListItem } from '../../../components/MUI';

import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import CardHeader from '@material-ui/core/CardHeader';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import EmojiEvents from '@material-ui/icons/EmojiEvents';

export default function AthleteHistory(props) {
  const { t } = useTranslation();
  const { isSelf, achievements } = props;
  const [privacy, setPrivacy] = useState('public');

  const handleChange = event => {
    setPrivacy(event.target.value);
  };

  return (
    <Card className={styles.card}>
      <CardHeader title={t('athlete_history')} />
      <List>
        {achievements.map((s, index) => {
          return (
            <ListItem key={index}>
              <ListItemIcon>
                <EmojiEvents />
              </ListItemIcon>
              <ListItemText primary={s} />
              {isSelf ? (
                <Select
                  className={styles.select}
                  labelId="public-or-private"
                  id="public-or-private"
                  value={privacy}
                  onChange={handleChange}
                >
                  <MenuItem value={'public'}>{'public'}</MenuItem>
                  <MenuItem value={'private'}>
                    {t('private')}
                  </MenuItem>
                </Select>
              ) : (
                <></>
              )}
            </ListItem>
          );
        })}
      </List>
    </Card>
  );
}
