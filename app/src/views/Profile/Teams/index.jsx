import React, { useState } from 'react';

import { useTranslation } from 'react-i18next';
import styles from './Teams.module.css';
import { Avatar } from '../../../components/Custom';
import {
  TextField,
  Card,
  List,
  ListItem,
} from '../../../components/MUI';

import getInitialsFromName from '../../../utils/getInitialsFromName';

import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import CardHeader from '@material-ui/core/CardHeader';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import EmojiEvents from '@material-ui/icons/EmojiEvents';

export default function Teams(props) {
  const { t } = useTranslation();
  const { isSelf, teams } = props;
  const [privacy, setPrivacy] = useState('public');

  const handleChange = event => {
    setPrivacy(event.target.value);
  };

  return (
    <Card className={styles.card}>
      <CardHeader title={t('teams')} />
      <List>
        {teams.map((s, index) => {
          return (
            <ListItem key={index}>
              <ListItemIcon>
                <Avatar
                  initials={getInitialsFromName(s)}
                  photoUrl={null}
                />
              </ListItemIcon>
              <TextField
                disabled
                value={s}
                className={styles.textField}
              />
            </ListItem>
          );
        })}
      </List>
    </Card>
  );
}
