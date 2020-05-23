import React from 'react';

import { makeStyles } from '@material-ui/core/styles';

import {
  List,
  ListItem,
  ListSubheader,
  ListItemIcon,
  ListItemText,
} from '../../MUI';
import { Icon } from '..';

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
  const { title, items, ref, rowRenderer, selectedIndex } = props;
  const classes = useStyles();

  const defaultRowRenderer = (item, index) => (
    <ListItem
      button
      onClick={item.onClick}
      selected={selectedIndex === index}
      key={`${item.value}${index}`}
      style={{ width: '100%' }}
    >
      {item.iconComponent ? (
        <ListItemIcon>{item.iconComponent}</ListItemIcon>
      ) : (
        <ListItemIcon>
          <Icon icon={item.icon} />
        </ListItemIcon>
      )}
      <ListItemText primary={item.value} />
    </ListItem>
  );

  return (
    <List
      ref={ref}
      style={{ maxWidth: 'unset' }}
      aria-labelledby="nested-list-subheader"
      subheader={
        title ? (
          <ListSubheader component="div" id="nested-list-subheader">
            {title}
          </ListSubheader>
        ) : (
          <></>
        )
      }
      className={classes.root}
      disablePadding={true}
    >
      {items && items.map(rowRenderer || defaultRowRenderer)}
    </List>
  );
}
