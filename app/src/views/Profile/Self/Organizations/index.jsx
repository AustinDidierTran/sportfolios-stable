import React from 'react';

import { useTranslation } from 'react-i18next';
import styles from './Organizations.module.css';
import { Avatar } from '../../../../components/Custom';
import {
  TextField,
  Card,
  List,
  ListItem,
  ListItemIcon,
} from '../../../../components/MUI';
import CardHeader from '@material-ui/core/CardHeader';

export default function Organizations(props) {
  const { t } = useTranslation();

  return (
    <Card className={styles.card}>
      <CardHeader title={t('organizations')} />
      <List>
        <ListItem>
          <ListItemIcon>
            <Avatar initials={'AUS'} photoUrl={null} />
          </ListItemIcon>
          <TextField
            disabled
            value={"Nom de l'organisations"}
            className={styles.textField}
          />
        </ListItem>
      </List>
    </Card>
  );
}
