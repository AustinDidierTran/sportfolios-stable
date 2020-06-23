import React from 'react';
import { useTranslation } from 'react-i18next';

import { makeStyles } from '@material-ui/core/styles';

import styles from './FollowingUsersCard.module.css';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
}));

import { Avatar, Paper } from '../../../../components/Custom';

import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from '../../../../components/MUI';
import { goTo, ROUTES } from '../../../../actions/goTo';

export default function FollowingUsersCard(props) {
  const { t } = useTranslation();
  const classes = useStyles();

  const { users } = props;

  const fullName = user => `${user.first_name} ${user.last_name}`;

  const initials = user =>
    fullName(user)
      .split(/(?:-| )+/)
      .reduce(
        (prev, curr, index) =>
          index <= 2 ? `${prev}${curr[0]}` : prev,
        '',
      );

  return (
    <Paper className={styles.card}>
      <Typography gutterBottom component="h2" variant="h5">
        {t('following')}
      </Typography>
      <List
        component="nav"
        aria-labelledby="nested-list-subheader"
        className={classes.root}
        disablePadding
        className={styles.list}
      >
        {users.length ? (
          users.map(user => (
            <ListItem
              button
              onClick={() =>
                goTo(ROUTES.entity, { id: user.user_id })
              }
              key={fullName(user)}
            >
              <ListItemIcon className={styles.icon}>
                <Avatar
                  initials={initials(user)}
                  className={styles.avatar}
                  photoUrl={user.photoUrl}
                  size="md"
                />
              </ListItemIcon>
              <ListItemText primary={fullName(user)} />
            </ListItem>
          ))
        ) : (
          <Typography gutterBottom component="h4" variant="h5">
            {t('no_following')}
          </Typography>
        )}
      </List>
    </Paper>
  );
}
