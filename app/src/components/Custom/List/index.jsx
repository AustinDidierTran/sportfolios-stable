import React from 'react';

import { makeStyles } from '@material-ui/core/styles';

import {
  List,
  ListItem,
  ListSubheader,
  ListItemIcon,
  ListItemText,
} from '../../MUI';
import { Icon } from '../../Custom';
import SendIcon from '@material-ui/icons/Send';

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

export default function CustomList(props) {
  const { title, items, ref } = props;
  const classes = useStyles();

  const handleClick = () => {
    console.log('handleClick');
  };

  return (
    <List
      ref={ref}
      component="nav"
      aria-labelledby="nested-list-subheader"
      subheader={
        <ListSubheader component="div" id="nested-list-subheader">
          {title}
        </ListSubheader>
      }
      className={classes.root}
      disablePadding={true}
    >
      {items.map(item => (
        <ListItem button onClick={item.onClick}>
          <ListItemIcon>
            <Icon icon={item.icon} />
          </ListItemIcon>
          <ListItemText primary={item.value} />
        </ListItem>
      ))}
    </List>
  );
}
