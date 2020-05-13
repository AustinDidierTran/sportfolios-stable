import React from 'react';

import { useTranslation } from 'react-i18next';
import styles from './Organizations.module.css';
import {
  TextField,
  Card,
  List,
  ListItem,
  ListItemIcon,
} from '../../../../../components/MUI';
import { Avatar } from '../../../../../components/Custom';

import CardHeader from '@material-ui/core/CardHeader';

export default function Organizations(props) {
  const { t } = useTranslation();

  return (
    <Card className={styles.card}>
      <CardHeader title={t('organizations')} />
      <List>
        <ListItem>
          <ListItemIcon>
            <Avatar
              className={styles.avatar}
              initials={'AUS'}
              photoUrl={null}
            />
          </ListItemIcon>
          <TextField
            disabled
            value={"Association d'Ultimate de Sherbrooke"}
            className={styles.textField}
          />
        </ListItem>
      </List>
    </Card>
  );
}
