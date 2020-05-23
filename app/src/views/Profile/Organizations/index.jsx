import React, { useState } from 'react';

import { useTranslation } from 'react-i18next';
import styles from './Organizations.module.css';
import { Avatar } from '../../../components/Custom';
import {
  TextField,
  Card,
  List,
  ListItem,
} from '../../../components/MUI';
import CardHeader from '@material-ui/core/CardHeader';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import getInitialsFromName from '../../../utils/getInitialsFromName';

export default function Organizations(props) {
  const { t } = useTranslation();
  const { isSelf, organizations } = props;
  const [privacy, setPrivacy] = useState('public');

  const handleChange = event => {
    setPrivacy(event.target.value);
  };

  return (
    <Card className={styles.card}>
      <CardHeader title={t('athlete_history')} />
      <List>
        {organizations.map((s, index) => {
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
