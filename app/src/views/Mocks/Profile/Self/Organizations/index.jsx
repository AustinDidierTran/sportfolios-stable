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
              photoUrl={
                'https://scontent.fymq2-1.fna.fbcdn.net/v/t1.0-9/27067856_10154940107067136_3164725535508385407_n.png?_nc_cat=100&_nc_sid=85a577&_nc_oc=AQmiz8Z-_v_Y7rpZLGpB2pLlIbOvHVM-LMI_au5IPQWaefKpq8zXddcpDCBbTiSB8Ws&_nc_ht=scontent.fymq2-1.fna&oh=58837d916fdbd81ad86412af503f10d0&oe=5EE31929'
              }
            />
          </ListItemIcon>
          <TextField
            disabled
            value={"Association d'Ultimate de Sherbrooke"}
            className={styles.textField}
          />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <Avatar
              className={styles.avatar}
              initials={'FQU'}
              photoUrl={
                'https://pbs.twimg.com/profile_images/2171703902/fqu_logo_400x400.jpg'
              }
            />
          </ListItemIcon>
          <TextField
            disabled
            value={"Fédération Québécoise d'Ultimate"}
            className={styles.textField}
          />
        </ListItem>
      </List>
    </Card>
  );
}
